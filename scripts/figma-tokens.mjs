#!/usr/bin/env node
/**
 * figma-tokens — pull design tokens from Figma, diff them against the repo, and
 * apply only the safe changes. Conflicting changes are held back until a human
 * confirms them.
 *
 *   node scripts/figma-tokens.mjs pull   [--from <file>] [--out .figma/snapshot.json]
 *   node scripts/figma-tokens.mjs diff   [--from <file>] [--json]
 *   node scripts/figma-tokens.mjs apply  [--from <file>] [--accept a.b.c,x.y] [--dry-run] [--no-adds]
 *   node scripts/figma-tokens.mjs verify
 *   node scripts/figma-tokens.mjs scaffold-component <Name>
 *
 * Live Figma:  export FIGMA_TOKEN=<PAT>  FIGMA_FILE_KEY=<key>   (then omit --from)
 * Offline:     --from defaults to .figma/snapshot.json, else the checked-in
 *              fixture .figma/fixtures/variables.local.sample.json
 *
 * Exit codes:  0 clean · 2 conflicts / naming violations need review · 1 error
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...p) => join(ROOT, ...p);
const rel = (p) => p.replace(ROOT + '/', '');

const CONFIG = JSON.parse(readFileSync(P('.figma/figma-tokens.config.json'), 'utf8'));
const FIXTURE = P('.figma/fixtures/variables.local.sample.json');
const SNAPSHOT = P('.figma/snapshot.json');
const RESOLVED = P('libs/tokens/generated/json/tokens.json');

// ---------------------------------------------------------------------------
// arg parsing
// ---------------------------------------------------------------------------
const [, , cmd, ...rest] = process.argv;
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a.startsWith('--')) {
    const k = a.slice(2);
    const next = rest[i + 1];
    if (next && !next.startsWith('--')) { flags[k] = next; i++; } else flags[k] = true;
  } else positional.push(a);
}
const die = (msg) => { console.error(msg); process.exit(1); };

// ---------------------------------------------------------------------------
// Figma → normalized model
// ---------------------------------------------------------------------------
function rgbaToHex({ r, g, b, a = 1 }) {
  const h = (n) => Math.round(Math.min(1, Math.max(0, n)) * 255).toString(16).padStart(2, '0');
  return a >= 1 ? `#${h(r)}${h(g)}${h(b)}` : `#${h(r)}${h(g)}${h(b)}${h(a)}`;
}
const kebab = (s) =>
  s.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

function startsWithNamespace(path, list) {
  return list.some((ns) => path === ns || path.startsWith(ns + '.'));
}

/** raw Figma REST payload -> { tokens: {path: {...}}, meta } */
function normalize(raw) {
  const meta = raw.meta ?? raw;
  const collections = meta.variableCollections ?? {};
  const variables = meta.variables ?? {};
  const tokens = {};

  for (const v of Object.values(variables)) {
    const coll = collections[v.variableCollectionId];
    const modeId = coll?.defaultModeId ?? Object.keys(v.valuesByMode ?? {})[0];
    if (modeId == null) continue;
    let value = v.valuesByMode?.[modeId];
    if (value == null) continue;
    if (value.type === 'VARIABLE_ALIAS') {
      const target = variables[value.id];
      value = target?.valuesByMode?.[coll?.defaultModeId] ?? value;
    }

    const rawSegs = v.name.split('/').map((s) => s.trim()).filter(Boolean);
    const aliasedFirst = CONFIG.nameAliases[rawSegs[0]?.toLowerCase()] ?? rawSegs[0];
    const segs = [aliasedFirst, ...rawSegs.slice(1)].map(kebab);
    const path = segs.join('.');

    const naming = [];
    for (const s of rawSegs) {
      if (!/^[a-z0-9-]+$/.test(s)) naming.push(`segment "${s}" is not lower-kebab-case`);
    }
    if (!startsWithNamespace(path, CONFIG.roleNamespaces)) {
      naming.push(`"${path}" is not under a known role namespace`);
    }

    let out, type;
    if (v.resolvedType === 'COLOR') {
      out = typeof value === 'object' ? rgbaToHex(value) : String(value);
      type = 'color';
    } else if (v.resolvedType === 'FLOAT') {
      if (startsWithNamespace(path, CONFIG.dimensionNamespaces)) {
        out = value === 0 ? '0' : `${value}px`;
        type = 'dimension';
      } else { out = String(value); type = 'number'; }
    } else {
      out = String(value);
      type = v.resolvedType === 'STRING' ? 'string' : 'boolean';
    }

    tokens[path] = {
      value: out,
      type,
      figmaName: v.name,
      collection: coll?.name ?? '(none)',
      infoOnly: startsWithNamespace(path, CONFIG.infoOnlyNamespaces),
      naming,
    };
  }
  return { tokens, meta: { source: 'figma', variableCount: Object.keys(tokens).length } };
}

async function fetchFigma() {
  const token = process.env.FIGMA_TOKEN;
  const key = process.env.FIGMA_FILE_KEY;
  if (!token || !key) return null;
  const res = await fetch(`https://api.figma.com/v1/files/${key}/variables/local`, {
    headers: { 'X-Figma-Token': token },
  });
  if (!res.ok) die(`Figma API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function loadFigmaModel() {
  if (flags.from) return normalize(JSON.parse(readFileSync(flags.from, 'utf8')));
  const live = await fetchFigma();
  if (live) return normalize(live);
  const src = existsSync(SNAPSHOT) ? SNAPSHOT : FIXTURE;
  if (src === FIXTURE) {
    console.error(`! no FIGMA_TOKEN and no ${rel(SNAPSHOT)} — using fixture ${rel(FIXTURE)}\n`);
  }
  return normalize(JSON.parse(readFileSync(src, 'utf8')));
}

// ---------------------------------------------------------------------------
// repo model
// ---------------------------------------------------------------------------
function loadRepoResolved() {
  if (!existsSync(RESOLVED)) die(`${rel(RESOLVED)} missing — run: npx nx build tokens`);
  const flat = {};
  (function walk(o, p = '') {
    for (const k of Object.keys(o)) {
      const np = p ? `${p}.${k}` : k;
      const v = o[k];
      if (v && typeof v === 'object') walk(v, np);
      else flat[np] = String(v);
    }
  })(JSON.parse(readFileSync(RESOLVED, 'utf8')));
  return flat;
}

// ---------------------------------------------------------------------------
// classify
// ---------------------------------------------------------------------------
const CONFLICT = new Set(['change', 'remove', 'rename?']);

const parentOf = (p) => p.split('.').slice(0, -1).join('.');

function classify(figma, repo) {
  const rows = [];
  const figmaPaths = new Set(Object.keys(figma.tokens));

  // A namespace counts as "Figma-authoritative" (so repo tokens missing from it
  // are real removals) only when Figma covers it at least as fully as the repo.
  const count = (set, ns) => [...set].filter((p) => parentOf(p) === ns).length;
  const authoritative = new Set(
    [...new Set([...figmaPaths].map(parentOf))].filter((ns) => {
      const fc = count(figmaPaths, ns);
      const rc = Object.keys(repo).filter((p) => parentOf(p) === ns).length;
      return fc >= 2 && rc > 0 && fc >= rc;
    }),
  );

  for (const [path, tk] of Object.entries(figma.tokens)) {
    const has = path in repo;
    let kind;
    if (!has) {
      const renameOf = Object.keys(repo).find(
        (rp) =>
          repo[rp] === tk.value &&
          !figmaPaths.has(rp) &&
          rp.split('.').slice(0, -1).join('.') === path.split('.').slice(0, -1).join('.'),
      );
      kind = renameOf ? 'rename?' : 'add';
      rows.push({ kind, path, from: renameOf ? `${renameOf} = ${repo[renameOf]}` : '—', to: tk.value, note: renameOf ? `possibly renamed from ${renameOf}` : '', tk });
    } else if (repo[path] === tk.value) {
      rows.push({ kind: tk.infoOnly ? 'info' : 'ok', path, from: repo[path], to: tk.value, note: '', tk });
    } else {
      rows.push({ kind: tk.infoOnly ? 'info' : 'change', path, from: repo[path], to: tk.value, note: tk.infoOnly ? 'primitive — review only' : '', tk });
    }
    for (const n of tk.naming) rows.push({ kind: 'naming', path, from: tk.figmaName, to: tk.value, note: n, tk });
  }

  for (const rp of Object.keys(repo)) {
    if (figmaPaths.has(rp)) continue;
    if (startsWithNamespace(rp, CONFIG.infoOnlyNamespaces)) continue;
    if (authoritative.has(parentOf(rp))) {
      rows.push({ kind: 'remove', path: rp, from: repo[rp], to: '—', note: 'in repo, absent from Figma', tk: null });
    }
  }
  return rows;
}

function summarize(rows) {
  const by = (k) => rows.filter((r) => r.kind === k);
  const changingPaths = new Set(rows.filter((r) => CONFLICT.has(r.kind) || r.kind === 'add').map((r) => r.path));
  const naming = by('naming');
  return {
    ok: by('ok').length, info: by('info').length, add: by('add').length,
    change: by('change'), remove: by('remove'), rename: by('rename?'), naming,
    // A naming issue blocks only when it rides on a token we'd otherwise write.
    namingBlocking: naming.filter((r) => changingPaths.has(r.path)),
    namingAdvisory: naming.filter((r) => !changingPaths.has(r.path)),
    conflicts: rows.filter((r) => CONFLICT.has(r.kind)),
  };
}

const ICON = { ok: '  ', info: 'ℹ ', add: '＋ ', change: '～ ', 'rename?': '⇄ ', remove: '－ ', naming: '⚠ ' };

function printReport(rows) {
  const order = ['change', 'remove', 'rename?', 'naming', 'add', 'info', 'ok'];
  rows.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  for (const r of rows) {
    if (r.kind === 'ok') continue;
    const head = `${ICON[r.kind] ?? '? '}${r.kind.toUpperCase().padEnd(8)} ${r.path}`;
    const detail =
      r.kind === 'add' ? `= ${r.to}`
      : r.kind === 'naming' ? `${r.note}`
      : r.kind === 'remove' ? `repo has ${r.from}`
      : `${r.from}  →  ${r.to}${r.note ? `   (${r.note})` : ''}`;
    console.log(`${head}\n     ${detail}`);
  }
  const s = summarize(rows);
  console.log(
    `\n${s.ok} ok · ${s.add} add · ${s.change.length} changed · ${s.remove.length} removed · ` +
      `${s.rename.length} rename? · ${s.naming.length} naming (${s.namingBlocking.length} blocking) · ${s.info} info`,
  );
  return s;
}

// ---------------------------------------------------------------------------
// write into source JSON
// ---------------------------------------------------------------------------
function targetFile(path) {
  for (const [prefix, file] of CONFIG.writeTargets) if (path.startsWith(prefix)) return P('libs/tokens/src', file);
  return null;
}
function setDeep(obj, segs, leaf) {
  let o = obj;
  for (const s of segs.slice(0, -1)) o = o[s] ??= {};
  o[segs[segs.length - 1]] = leaf;
}
function delDeep(obj, segs) {
  let o = obj;
  for (const s of segs.slice(0, -1)) { if (!o[s]) return; o = o[s]; }
  delete o[segs[segs.length - 1]];
}

function applyRows(rows, { accept, dryRun, noAdds }) {
  const s = summarize(rows);
  const blockingPaths = new Set(s.namingBlocking.map((r) => r.path));
  const files = new Map(); // absPath -> parsed json
  const load = (f) => { if (!files.has(f)) files.set(f, JSON.parse(readFileSync(f, 'utf8'))); return files.get(f); };
  const applied = [];
  const pending = [];
  const advisories = s.namingAdvisory;

  for (const r of rows) {
    const isAdd = r.kind === 'add';
    const isConflict = CONFLICT.has(r.kind);
    if (r.kind === 'naming') { if (blockingPaths.has(r.path)) pending.push(r); continue; }
    if (!isAdd && !isConflict) continue;
    const ok = isAdd ? !noAdds : accept.has(r.path);
    if (!ok) { pending.push(r); continue; }

    const f = targetFile(r.path);
    if (!f) { pending.push({ ...r, note: 'no writeTargets entry — add one to .figma/figma-tokens.config.json' }); continue; }
    const json = load(f);
    const segs = r.path.split('.');
    if (r.kind === 'remove') delDeep(json, segs);
    else setDeep(json, segs, { value: r.to, type: r.tk?.type ?? 'string' });
    applied.push({ ...r, file: rel(f) });
  }

  if (!dryRun) {
    for (const [f, json] of files) writeFileSync(f, JSON.stringify(json, null, 2) + '\n');
    // Normalise to the repo's formatting so the diff stays reviewable.
    try {
      execSync(`npx prettier --write ${[...files.keys()].map((f) => `"${f}"`).join(' ')}`, { cwd: ROOT, stdio: 'ignore' });
    } catch { /* prettier optional */ }
  }
  return { applied, pending, advisories, files: [...files.keys()].map(rel) };
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------
async function cmdPull() {
  const model = await loadFigmaModel();
  const out = flags.out || SNAPSHOT;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(model, null, 2) + '\n');
  console.log(`wrote ${rel(out)} — ${model.meta.variableCount} tokens`);
}

async function cmdDiff() {
  const model = await loadFigmaModel();
  const rows = classify(model, loadRepoResolved());
  if (flags.json) { console.log(JSON.stringify(rows, null, 2)); }
  const s = flags.json ? summarize(rows) : printReport(rows);
  if (s.namingAdvisory.length) {
    console.log(`\nℹ ${s.namingAdvisory.length} advisory naming issue(s) (value already matches — fix the name in Figma when convenient).`);
  }
  if (s.conflicts.length || s.namingBlocking.length) {
    console.log(
      `\n✗ ${s.conflicts.length} conflict(s) + ${s.namingBlocking.length} blocking naming issue(s) need a human decision.` +
        `\n  Review each with the user, then:  node scripts/figma-tokens.mjs apply --accept ${s.conflicts.map((r) => r.path).slice(0, 3).join(',')}${s.conflicts.length > 3 ? ',…' : ''}`,
    );
    process.exit(2);
  }
  console.log('\n✓ only additive / no changes — safe to apply');
}

async function cmdApply() {
  const model = await loadFigmaModel();
  const rows = classify(model, loadRepoResolved());
  const accept = new Set(String(flags.accept || '').split(',').map((s) => s.trim()).filter(Boolean));
  const res = applyRows(rows, { accept, dryRun: !!flags['dry-run'], noAdds: !!flags['no-adds'] });

  if (res.applied.length) {
    console.log(`${flags['dry-run'] ? 'would apply' : 'applied'} ${res.applied.length} change(s):`);
    for (const a of res.applied) console.log(`  ${ICON[a.kind]}${a.path}  →  ${a.to}   [${a.file}]`);
  } else console.log('nothing applied');

  for (const a of res.advisories) console.log(`  ${ICON.naming}advisory: ${a.path} — ${a.note}`);

  if (res.pending.length) {
    console.log(`\n✗ ${res.pending.length} change(s) held back — confirm each with the user:`);
    for (const p of res.pending) {
      console.log(`  ${ICON[p.kind] ?? '? '}${p.path}   ${p.kind === 'naming' ? p.note : `${p.from} → ${p.to}`}`);
    }
    console.log(
      `\n  To accept specific ones after confirmation:\n` +
        `    node scripts/figma-tokens.mjs apply --accept ${res.pending.filter((p) => p.kind !== 'naming').map((p) => p.path).join(',')}\n` +
        `  Naming issues must be fixed in Figma or mapped in .figma/figma-tokens.config.json (nameAliases).`,
    );
    process.exit(2);
  }
  if (!flags['dry-run'] && res.applied.length) {
    console.log(`\nNext:  npx nx build tokens  &&  node scripts/figma-tokens.mjs verify`);
  }
}

function sh(c) { console.log(`\n$ ${c}`); execSync(c, { cwd: ROOT, stdio: 'inherit' }); }

async function cmdVerify() {
  sh('npx nx build tokens');
  const model = await loadFigmaModel();
  const css = readFileSync(P('libs/tokens/generated/css/tokens.css'), 'utf8');
  const miss = [];
  for (const [path, tk] of Object.entries(model.tokens)) {
    if (tk.infoOnly || tk.naming.length) continue;
    if (!css.includes(`--ds-${path.replace(/\./g, '-')}: ${tk.value};`)) miss.push(`${path} = ${tk.value}`);
  }
  if (miss.length) {
    console.log(`\n✗ ${miss.length} Figma token(s) not found in generated tokens.css (unapplied or renamed):`);
    miss.forEach((m) => console.log(`  ${m}`));
    process.exit(2);
  }
  console.log('\n✓ every non-conflicting Figma token is present in tokens.css');
  sh('npx nx run-many -t test --projects=tokens,theme,ui');
  console.log(
    `\n✓ tokens/theme/ui tests pass.\n` +
      `Now verify the components:  npx nx serve demo  →  http://localhost:4200/tokens  (screenshot it)`,
  );
}

function cmdScaffold() {
  const name = positional[0];
  if (!name) die('usage: figma-tokens.mjs scaffold-component <Name>');
  const kb = kebab(name);
  const pascal = kb.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
  const dir = P('libs/ui/src/lib/atoms', kb);
  if (existsSync(dir)) die(`${rel(dir)} already exists`);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, `${kb}.component.ts`), `import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type Ds${pascal}Variant = 'primary' | 'secondary';
export type Ds${pascal}Size = 'sm' | 'md' | 'lg';

/**
 * ${pascal} — scaffolded from a Figma component. Fill in the template + styles
 * from the design; every value must be a \`var(--ds-*)\` token.
 */
@Component({
  selector: 'ds-${kb}',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-variant]': 'variant()', '[attr.data-size]': 'size()' },
  template: \`<span class="ds-${kb}__box"><ng-content /></span>\`,
  styles: [
    \`
      :host { display: inline-flex; font-family: var(--ds-font-family-base); }
      .ds-${kb}__box {
        padding: var(--ds-space-3) var(--ds-space-5);
        border-radius: var(--ds-radius-md);
        color: var(--ds-color-text-primary);
      }
      :host([data-variant='primary']) .ds-${kb}__box {
        background: var(--ds-color-action-primary);
        color: var(--ds-color-action-primary-contrast);
      }
    \`,
  ],
})
export class Ds${pascal}Component {
  readonly variant = input<Ds${pascal}Variant>('primary');
  readonly size = input<Ds${pascal}Size>('md');
}
`);

  writeFileSync(join(dir, `${kb}.stories.ts`), `import type { Meta, StoryObj } from '@storybook/angular';
import { Ds${pascal}Component } from './${kb}.component';

const meta: Meta<Ds${pascal}Component> = {
  title: 'Atoms/${pascal}',
  component: Ds${pascal}Component,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { variant: 'primary', size: 'md' },
  render: (args) => ({ props: args, template: \`<ds-${kb} [variant]="variant" [size]="size">${pascal}</ds-${kb}>\` }),
};
export default meta;
export const Playground: StoryObj<Ds${pascal}Component> = {};
`);

  writeFileSync(join(dir, `${kb}.spec.ts`), `import { TestBed } from '@angular/core/testing';
import { Ds${pascal}Component } from './${kb}.component';

describe('Ds${pascal}Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ds${pascal}Component] }).compileComponents();
  });

  it('reflects variant + size onto the host for token targeting', () => {
    const f = TestBed.createComponent(Ds${pascal}Component);
    f.componentRef.setInput('variant', 'secondary');
    f.componentRef.setInput('size', 'lg');
    f.detectChanges();
    const host = f.nativeElement as HTMLElement;
    expect(host.getAttribute('data-variant')).toBe('secondary');
    expect(host.getAttribute('data-size')).toBe('lg');
  });
});
`);

  const barrel = P('libs/ui/src/index.ts');
  const line = `export * from './lib/atoms/${kb}/${kb}.component';`;
  const cur = readFileSync(barrel, 'utf8');
  if (!cur.includes(line)) writeFileSync(barrel, cur.replace(/(\/\* atoms \*\/\n)/, `$1${line}\n`));

  console.log(`scaffolded ${rel(dir)} (component + stories + spec) and exported from libs/ui/src/index.ts`);
  console.log(`Next: fill it from Figma, add <ds-${kb}> to the Token Lab page, then: node scripts/figma-tokens.mjs verify`);
}

// ---------------------------------------------------------------------------
const commands = { pull: cmdPull, diff: cmdDiff, apply: cmdApply, verify: cmdVerify, 'scaffold-component': cmdScaffold };
if (!commands[cmd]) die(`usage: figma-tokens.mjs <pull|diff|apply|verify|scaffold-component>`);
Promise.resolve()
  .then(() => commands[cmd]())
  .catch((e) => die(e.stack || String(e)));
