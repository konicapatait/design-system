/**
 * `@brand/ui` — the atomic component library.
 *
 * Every component is standalone + `OnPush`, exposes a narrowed brand API over
 * its ng-zorro base, and paints exclusively from `--ds-*` tokens so a brand /
 * theme switch restyles it at runtime.
 *
 * Layers: tokens  ->  theme  ->  ui  ->  app
 */

/* atoms */
export * from './lib/atoms/button/button.component';
export * from './lib/atoms/icon/icon.component';
export * from './lib/atoms/spinner/spinner.component';
export * from './lib/atoms/tag/tag.component';
export * from './lib/atoms/text/text.component';
export * from './lib/atoms/input/input.component';
export * from './lib/atoms/select/select.component';

/* molecules */
export * from './lib/molecules/form-field/form-field.component';
export * from './lib/molecules/card/card.component';
export * from './lib/molecules/alert/alert.component';
export * from './lib/molecules/brand-theme-switcher/brand-theme-switcher.component';
