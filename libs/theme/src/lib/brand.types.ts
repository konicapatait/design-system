/**
 * Brand + colour-scheme identifiers.
 *
 * Kept local to `@brand/theme` (rather than imported from `@brand/tokens`) so
 * the runtime theming package has no build-time dependency on the token
 * pipeline. The values must stay in sync with the selector blocks emitted by
 * `libs/tokens/style-dictionary.config.mjs`.
 */
export type Brand = 'konica' | 'aurora';
export type ColorScheme = 'light' | 'dark';

export const BRANDS: readonly Brand[] = ['konica', 'aurora'] as const;
export const COLOR_SCHEMES: readonly ColorScheme[] = ['light', 'dark'] as const;
