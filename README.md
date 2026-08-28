# Brand Design System (Angular · ng-zorro · atomic)

An Nx monorepo that turns **design tokens** into a **brand-customised, publishable
Angular component library** on top of **ng-zorro-antd**. The atomic layering is:

```
@brand/tokens   Style Dictionary — the single source of visual truth
      │  (CSS custom properties + Less variables + TS)
      ▼
@brand/theme    runtime brand skin — BrandThemeService + ng-zorro Less compile
      │
      ▼
@brand/ui       standalone atoms + molecules, painted only from --ds-* tokens
      │
      ▼
apps/demo       one composed screen assembled entirely from @brand/ui
```

## Packages

| Path | Package | What it is |
| --- | --- | --- |
| `libs/tokens` | `@brand/tokens` | Token source JSON + `nx build tokens` (Style Dictionary). Emits `generated/{css,less,scss,ts,json}`. |
| `libs/theme` | `@brand/theme` | `BrandThemeService` / `provideBrandTheme()`, `base.css`, `ng-zorro-tokens.css`, and `nx run theme:styles` which compiles ng-zorro's Less with the tokens as variable overrides. |
| `libs/ui` | `@brand/ui` | The component library. Publishable via `nx build ui` (ng-packagr). |
| `apps/demo` | — | Demo app / reference screen. `nx serve demo`. |

## How branding works

1. **Tokens** are authored under `libs/tokens/src/` in layers — `core/` primitives →
   `semantic/` roles (`color.action.primary`, …) → `brand/<name>.json` overrides →
   `theme/dark.json`. `nx build tokens` produces one `tokens.css` with a selector
   block per brand × scheme:

   ```css
   :root { --ds-color-action-primary: #0067b1; }              /* konica, light */
   [data-brand="aurora"] { --ds-color-action-primary: #5a1fb8; }
   :root[data-theme="dark"] { --ds-color-action-primary: #2f7ed1; }
   [data-brand="aurora"][data-theme="dark"] { … }
   @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }
   ```

2. **`@brand/ui` components** never hard-code a colour — every value is
   `var(--ds-*)`. So switching brand/scheme is just toggling `data-brand` /
   `data-theme` on `<html>`; nothing re-renders.

3. **ng-zorro's own chrome** is handled two ways:
   - `nx run theme:styles` compiles `ng-zorro-antd.less` with the tokens injected
     as Less `modifyVars` → `generated/antd.css` (light baseline) and
     `generated/antd-dark.css` (scoped `[data-theme="dark"]`). Compiled here, not
     by the Angular builder, because Ant Design v4's Less needs
     `javascriptEnabled: true`.
   - `ng-zorro-tokens.css` re-points the ng-zorro surfaces the design system
     exposes (select, table, pagination, popovers) back at `--ds-*` so they also
     follow a **brand** switch at runtime.

4. `BrandThemeService` (signals) is the single source of truth for the active
   brand + scheme, mirrors them onto `<html>`, and persists the choice.

## Quick start

```bash
npm install
npx nx run-many -t build          # tokens → theme → ui → demo
npx nx serve demo                 # http://localhost:4200
npx nx storybook ui               # component explorer, brand/scheme in the toolbar
npx nx run-many -t test lint
```

## Wiring an app

```ts
// app.config.ts
providers: [
  provideAnimations(),
  provideNzI18n(en_US),
  provideNzIcons(icons),
  provideBrandTheme(),          // from @brand/theme
]
```

```jsonc
// project.json — styles, in this order
"styles": [
  "libs/tokens/generated/css/tokens.css",
  "libs/theme/generated/antd.css",
  "libs/theme/generated/antd-dark.css",
  "libs/theme/src/lib/styles/ng-zorro-tokens.css",
  "libs/theme/src/lib/styles/base.css"
]
```

## Replacing the placeholder tokens with Figma values

The token values in `libs/tokens/src/` are placeholders (a Konica-style blue
`konica` brand + a violet `aurora` brand to demonstrate multi-brand). To wire the
real design:

1. Connect the **Figma Dev Mode MCP server** (`claude mcp add --transport sse
   figma-dev-mode http://127.0.0.1:3845/sse`) or use the Figma REST API.
2. Pull the variable collections and map them onto the **existing token paths**
   in `libs/tokens/src/**` (keep the paths; change the values).
3. `nx build tokens` — every downstream package and Storybook updates.

## Components

Atoms: `ds-button` `ds-icon` `ds-spinner` `ds-tag` `ds-text` `ds-input` `ds-select`
Molecules: `ds-form-field` `ds-card` `ds-alert` `ds-brand-theme-switcher`

Every component is `standalone`, `OnPush`, uses signal `input()` / `output()`,
exposes variants via `data-*` host attributes, and — where it is a form control —
implements `ControlValueAccessor`. `ds-button` is the reference implementation.

## Release

`nx release` versions and publishes `@brand/tokens`, `@brand/theme`, `@brand/ui`
(conventional commits; `preVersionCommand` runs `nx run-many -t build`).
