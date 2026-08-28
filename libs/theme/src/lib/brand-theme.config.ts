import { InjectionToken } from '@angular/core';
import type { Brand, ColorScheme } from './brand.types';

export interface BrandThemeDefaults {
  /** Brand to use when the visitor has no persisted preference. */
  brand?: Brand;
  /** Colour scheme to use when the visitor has no persisted preference. */
  colorScheme?: ColorScheme;
}

/** Optional initial brand / scheme, applied only when nothing is persisted. */
export const BRAND_THEME_DEFAULTS = new InjectionToken<BrandThemeDefaults>(
  'BRAND_THEME_DEFAULTS',
);
