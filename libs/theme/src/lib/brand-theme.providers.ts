import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import {
  BRAND_THEME_DEFAULTS,
  type BrandThemeDefaults,
} from './brand-theme.config';
import { BrandThemeService } from './brand-theme.service';

/**
 * Registers the brand theming for an application.
 *
 * `BrandThemeService` is `providedIn: 'root'`, so this mainly forces it to be
 * created during app initialisation — early enough that `<html data-brand
 * data-theme>` is set before the first paint and there is no theme flash.
 *
 * Pass `defaults` to pick the brand an app ships with (e.g. `{ brand:
 * 'brand-3' }`); a visitor's saved choice still wins.
 */
export function provideBrandTheme(
  defaults: BrandThemeDefaults = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: BRAND_THEME_DEFAULTS, useValue: defaults },
    provideAppInitializer(() => {
      inject(BrandThemeService).brand();
    }),
  ]);
}
