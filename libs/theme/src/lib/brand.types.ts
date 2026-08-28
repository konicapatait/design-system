/**
 * Brand + colour-scheme identifiers.
 *
 * Kept local to `@brand/theme` (rather than imported from `@brand/tokens`) so
 * the runtime theming package has no build-time dependency on the token
 * pipeline. The values must stay in sync with the selector blocks emitted by
 * `libs/tokens/style-dictionary.config.mjs`.
 */
export type Brand = 'brand-1' | 'brand-2' | 'brand-3';
export type ColorScheme = 'light' | 'dark';

export const BRANDS: readonly Brand[] = ['brand-1', 'brand-2', 'brand-3'] as const;
export const COLOR_SCHEMES: readonly ColorScheme[] = ['light', 'dark'] as const;

/** Human-readable brand labels for pickers. */
export const BRAND_LABELS: Record<Brand, string> = {
  'brand-1': 'Brand 1',
  'brand-2': 'Brand 2',
  'brand-3': 'Brand 3',
};
