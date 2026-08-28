# Contributing a component

The library is **atomic**: `tokens → atoms → molecules → (app)`. A component may
only import from its own layer or below.

## Rules

| Rule | Why |
| --- | --- |
| `standalone: true` | no NgModules |
| `ChangeDetectionStrategy.OnPush` | predictable, fast |
| Signal `input()` / `output()` / `model()` | no decorators |
| Variants as `data-*` **host attributes**, styled `:host([data-x='y'])` | themable, inspectable, no class soup |
| Values are **only** `var(--ds-*)` | a brand/scheme switch must restyle it with zero code |
| Form controls implement `ControlValueAccessor` | drop into template + reactive forms |
| Co-locate `*.stories.ts` + `*.spec.ts` | discoverability |
| Missing a value? add a **token**, don't hard-code | keeps the system coherent |

## When to wrap ng-zorro vs build native

- **Wrap** (`ds-select`) when ng-zorro's behaviour / a11y / overlay handling is
  worth reusing and its surface can be re-pointed at tokens via
  `libs/theme/src/lib/styles/ng-zorro-tokens.css`.
- **Build native** (`ds-button`) when ng-zorro's compiled `.ant-*` rules would
  win the specificity fight and pin the Ant palette, defeating runtime brand
  switching.

## Steps

1. `libs/ui/src/lib/<atoms|molecules>/<name>/<name>.component.ts`
   — model it on `atoms/button/button.component.ts`.
2. Export it from `libs/ui/src/index.ts`.
3. Add `<name>.stories.ts` (a `Playground` + a variants gallery) and
   `<name>.spec.ts` (behaviour + a11y attributes).
4. If it surfaces a new ng-zorro widget, add token bindings for that widget's
   classes to `ng-zorro-tokens.css`.
5. `nx run-many -t lint test build` and `nx storybook ui` before opening a PR.

## New token

1. Add it under `libs/tokens/src/` in the right layer (`core` primitive vs
   `semantic` role). Reference lower layers with `{path.to.token}`.
2. `nx build tokens`.
3. It is now `--ds-<kebab-path>` in CSS and `cssVar('<kebab-path>')` in TS.
