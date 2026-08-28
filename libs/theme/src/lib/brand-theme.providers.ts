import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { BrandThemeService } from './brand-theme.service';

/**
 * Registers the brand theming for an application.
 *
 * `BrandThemeService` is `providedIn: 'root'`, so this only forces it to be
 * created during app initialisation — early enough that `<html data-brand
 * data-theme>` is set before the first paint and there is no theme flash.
 */
export function provideBrandTheme(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      // Instantiate the service; its constructor effect wires up the DOM.
      inject(BrandThemeService).brand();
    }),
  ]);
}
