---
name: figma-tokens
description: Sync design tokens from Figma into this repo safely and turn Figma components into code. Use when asked to pull tokens from Figma, diff or validate tokens against a Figma file, resolve a token conflict, apply Figma variable changes, generate/scaffold a component from Figma, or verify the design-system demo after a token change.
---

All paths are relative to the repo root (`design-system/`).

The driver is **`scripts/figma-tokens.mjs`** (also `npm run figma:pull|diff|apply|verify`).
Figma owns token **values**; the repo owns token **names / structure / aliases**.
The rule the driver enforces: **a Figma change to an existing token is never
applied automatically — it is held back until a human confirms it.**

With no `FIGMA_TOKEN` the driver runs against the checked-in stub
`.figma/fixtures/variables.local.sample.json` (prints a `! …using fixture`
banner). That fixture is shaped to hit every diff class, so the commands below
work offline exactly as shown.

## Prerequisites

Node 20 (the repo default) and `npm install` already run. No system packages.

Live Figma (optional):

```bash
export FIGMA_TOKEN=<PAT with scope file_variables:read>
export FIGMA_FILE_KEY=<KEY from figma.com/design/<KEY>/...>
```

## Run (agent path)

### 1. See what Figma wants to change

```bash
node scripts/figma-tokens.mjs diff
```

Classifies every incoming variable and exits:

| exit | meaning |
| --- | --- |
| `0` | only `add` / `ok` — safe to apply |
| `2` | `change` / `remove` / `rename?` conflicts, or a naming issue on a changing token — **stop and ask the user** |
| `1` | error (e.g. `generated/json/tokens.json` missing) |

Row kinds: `～ CHANGE` `－ REMOVE` `⇄ RENAME?` `⚠ NAMING` `＋ ADD` `ℹ INFO` `ok`.

### 2. Apply the safe part

```bash
node scripts/figma-tokens.mjs apply
```

Writes **only** the additive tokens into the right `libs/tokens/src/*.json` file.
Everything conflicting is printed under "held back — confirm each with the user"
and the command exits `2`.

### 3. Get confirmation, then accept specific paths

Show the user each held-back row as `old → new`. For the ones they approve:

```bash
node scripts/figma-tokens.mjs apply --accept color.text.link,radius.md,radius.xl
```

Only the listed token paths are written (as a change, or a delete for a
`REMOVE`). Anything not listed stays held back.

### 4. Rebuild + verify

```bash
npx nx build tokens
node scripts/figma-tokens.mjs verify
```

`verify` rebuilds tokens, asserts every non-conflicting Figma value is present in
`libs/tokens/generated/css/tokens.css`, then runs `tokens` / `theme` / `ui` tests.

### 5. Verify the components in the demo

```bash
npx nx serve demo    # then open http://localhost:4200/tokens  (Token Lab) and screenshot it
```

The **Token Lab** page (`apps/demo/src/app/pages/token-lab/`) renders every
generated token as a swatch plus every `@brand/ui` component with stubbed data
(`token-lab.fixtures.ts`). Check it in all three brands and both schemes via the
header switcher.

## Generate a component from Figma

Load the `figma-design-to-code` skill before `get_design_context`. Reuse existing
atoms + `--ds-*` tokens. Scaffold the standard triplet:

```bash
node scripts/figma-tokens.mjs scaffold-component RiskBadge
```

Creates `libs/ui/src/lib/atoms/risk-badge/` (`*.component.ts` + `*.stories.ts` +
`*.spec.ts`), exports it from `libs/ui/src/index.ts`. Then fill it from the
design, add `<ds-risk-badge>` to the Token Lab page, and run `verify`.

## Direct invocation

```bash
node scripts/figma-tokens.mjs diff --from .figma/fixtures/variables.local.sample.json
node scripts/figma-tokens.mjs diff --json            # machine-readable rows
node scripts/figma-tokens.mjs apply --dry-run        # print planned writes, touch nothing
node scripts/figma-tokens.mjs pull --out .figma/snapshot.json
```

## Gotchas

- **`diff` reads `libs/tokens/generated/json/tokens.json`, not the source JSON.**
  After `apply` it is stale — always `npx nx build tokens` before diffing again,
  or the change still shows as a conflict.
- **Removal detection is conservative.** A repo token missing from Figma is only
  reported as `REMOVE` when Figma covers that namespace at least as fully as the
  repo (`figmaCount >= repoCount && figmaCount >= 2`). A partial variable export
  will not propose deleting the rest of a group.
- **Naming: advisory vs blocking.** A badly-named Figma variable whose value
  already matches the repo is advisory (doesn't block `apply`). The same naming
  issue on a token whose value is *also* changing blocks — fix the name in Figma
  or add a `nameAliases` entry in `.figma/figma-tokens.config.json`.
- **`apply` reformats the JSON it touches** (2-space, then `prettier`). The first
  real sync makes a large formatting diff — that is expected; the token JSON is
  Figma-managed from then on.
- **`color.palette.*` is review-only** (`infoOnlyNamespaces` in the config). The
  driver reports primitive changes as `ℹ INFO` and never writes them.
- **FLOAT → `px`** only for paths under `dimensionNamespaces` (`space`, `radius`,
  `size`, …). A FLOAT anywhere else is emitted unitless.

## Troubleshooting

- **`libs/tokens/generated/json/tokens.json missing — run: npx nx build tokens`**:
  the resolved token set hasn't been built yet. Run that, then retry.
- **diff still lists the same conflict right after `apply --accept`**: you skipped
  `npx nx build tokens`. The source JSON changed; the resolved snapshot didn't.
- **`Figma API 403` / empty variables**: the PAT needs `file_variables:read`, and
  the REST `variables/local` endpoint is Enterprise-only. Otherwise use the Dev
  Mode MCP (`get_variable_defs`) or paste an export into
  `.figma/fixtures/` and pass `--from`.
- **`apply` prints `no writeTargets entry`**: add a `["<path-prefix>", "<file>"]`
  row to `writeTargets` in `.figma/figma-tokens.config.json`.
