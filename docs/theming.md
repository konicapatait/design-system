# Theming & branding

## Token layers (`libs/tokens/src/`)

```
core/        primitive palette, spacing/radius scale, type scale, effects   (raw values)
semantic/    role tokens — color.action.*, color.text.*, color.bg.*, …      (reference core)
brand/       brand-1.json, brand-2.json, brand-3.json — remap the brand ramp + a few roles
theme/       dark.json — overrides for surfaces / text / borders in dark    (reference core/semantic)
```

`nx build tokens` runs Style Dictionary (`libs/tokens/style-dictionary.config.mjs`)
and emits `libs/tokens/generated/`:

| File | Consumed by |
| --- | --- |
| `css/tokens.css` | every app + Storybook — one `:root` / `[data-brand]` / `[data-theme]` block per brand × scheme, plus a `@media (prefers-color-scheme: dark)` pre-hydration fallback |
| `less/_tokens.less` | reference only (the ng-zorro compile reads `json/`) |
| `scss/_tokens.scss` | apps that use Sass |
| `ts/tokens.mjs` + `.d.ts` | non-CSS consumers (e.g. chart colours) |
| `json/tokens.json`, `json/tokens.dark.json` | `nx run theme:styles` (ng-zorro Less compile) |

### CSS custom-property naming

`--ds-<kebab-path>` — e.g. `color.action.primary` → `--ds-color-action-primary`,
`radius.md` → `--ds-radius-md`. Use `cssVar('color-action-primary')` from
`@brand/tokens` in TS.

## How a brand / scheme switch propagates

1. `BrandThemeService.setBrand()` / `.toggleColorScheme()` set signals.
2. Its `effect()` writes `document.documentElement.dataset.brand` / `.theme`
   and `style.colorScheme`, and persists to `localStorage`.
3. The matching block in `tokens.css` wins the cascade, so every `var(--ds-*)`
   resolves to the new value. **No component re-renders.**

Specificity is deliberate: `[data-brand="brand-2"][data-theme="dark"]` (0,2,0)
is emitted after `:root[data-theme="dark"]` (0,2,0) so it wins on order; the
`@media` fallback is scoped `:not([data-theme])` so it never fights an explicit
choice.

## ng-zorro

ng-zorro's own chrome is themed in two passes:

1. **`nx run theme:styles`** compiles `ng-zorro-antd.less` with the tokens as
   Less `modifyVars` → `generated/antd.css` (light) and `generated/antd-dark.css`
   (wrapped in `[data-theme="dark"]`). Compiled by `libs/theme/build-antd-theme.mjs`
   with `javascriptEnabled: true`, which the Angular builder cannot do.
   These bake the parts of ng-zorro that its Less computes (borders, shadows,
   sizing, the deep component internals).
2. **`ng-zorro-tokens.css`** (hand-authored, in `@brand/theme`) re-points the
   ng-zorro surfaces the design system actually exposes — select, table,
   pagination, popovers — back at `--ds-*`, so they also follow a **brand**
   switch at runtime (the Less compile is per-brand static).

`@brand/ui` components that would lose a specificity fight with ng-zorro's
compiled rules (notably `ds-button`) are built as native elements instead of
wrapping `nz-*`.

## Adding a brand

1. `libs/tokens/src/brand/<name>.json` — remap `color.brand.*` (and any role
   overrides).
2. Add `<name>` to `BRANDS` in `libs/tokens/style-dictionary.config.mjs` and to
   `libs/theme/src/lib/brand.types.ts`.
3. `nx build tokens`. The new `[data-brand="<name>"]` blocks appear automatically.

## Wiring the real Figma tokens

Replace the **values** in `libs/tokens/src/**` (keep the token paths) from the
Figma variable collections — via the Figma Dev Mode MCP server or the REST API —
then `nx build tokens`. Everything downstream updates.
