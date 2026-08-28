/**
 * `@brand/theme` — the runtime brand skin.
 *
 * Ships:
 *  - `BrandThemeService` / `provideBrandTheme()` — active brand + colour scheme,
 *    mirrored onto `<html data-brand data-theme>`.
 *  - `src/lib/styles/base.css` — token-driven element defaults.
 *  - `src/lib/styles/ng-zorro-tokens.css` — re-points the ng-zorro surfaces the
 *    design system exposes at `--ds-*` so they follow a brand switch at runtime.
 *  - `generated/antd.css` + `generated/antd-dark.css` — ng-zorro compiled with
 *    the design tokens as Less variable overrides (`nx run theme:styles`).
 *
 * Apps list these in their build `styles` in the order:
 *   tokens.css → antd.css → antd-dark.css → ng-zorro-tokens.css → base.css
 */
export { BrandThemeService } from './lib/brand-theme.service';
export { provideBrandTheme } from './lib/brand-theme.providers';
export {
  BRAND_THEME_DEFAULTS,
  type BrandThemeDefaults,
} from './lib/brand-theme.config';
export { BRANDS, BRAND_LABELS, COLOR_SCHEMES } from './lib/brand.types';
export type { Brand, ColorScheme } from './lib/brand.types';
