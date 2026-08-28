import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BrandThemeService, type Brand } from '@brand/theme';

/**
 * Demo / Storybook control that drives {@link BrandThemeService}. Proves the
 * whole system re-skins at runtime: changing brand or scheme only toggles
 * `data-*` on `<html>`, and every token + ng-zorro surface follows.
 */
@Component({
  selector: 'ds-brand-theme-switcher',
  standalone: true,
  imports: [NzSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ds-switcher" [attr.data-layout]="layout()">
      <div class="ds-switcher__group">
        <span id="ds-switcher-brand-label" class="ds-switcher__label">Brand</span>
        <nz-select
          [ngModel]="theme.brand()"
          (ngModelChange)="setBrand($event)"
          nzSize="small"
          class="ds-switcher__select"
          aria-labelledby="ds-switcher-brand-label"
        >
          @for (b of theme.availableBrands; track b) {
            <nz-option [nzValue]="b" [nzLabel]="titleCase(b)" />
          }
        </nz-select>
      </div>

      <button
        type="button"
        class="ds-switcher__toggle"
        [attr.aria-pressed]="theme.isDark()"
        (click)="theme.toggleColorScheme()"
      >
        <span class="ds-switcher__dot" aria-hidden="true"></span>
        <span>{{ theme.isDark() ? 'Dark' : 'Light' }}</span>
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .ds-switcher {
        display: flex;
        align-items: center;
        gap: var(--ds-space-4);
      }
      .ds-switcher[data-layout='stacked'] {
        flex-direction: column;
        align-items: stretch;
      }
      .ds-switcher__group {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-3);
      }
      .ds-switcher__label {
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-medium);
        color: var(--ds-color-text-tertiary);
        text-transform: uppercase;
        letter-spacing: var(--ds-font-letter-spacing-wide);
      }
      .ds-switcher__select {
        min-width: 116px;
      }
      .ds-switcher__toggle {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
        min-height: var(--ds-size-control-sm);
        padding-inline: var(--ds-space-4);
        border: var(--ds-border-width-hair) solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-pill);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-secondary);
        font: inherit;
        font-size: var(--ds-font-size-sm);
        cursor: pointer;
      }
      .ds-switcher__toggle:hover {
        border-color: var(--ds-color-border-strong);
        color: var(--ds-color-text-primary);
      }
      .ds-switcher__toggle:focus-visible {
        outline: var(--ds-border-width-thick) solid var(--ds-color-border-focus);
        outline-offset: 2px;
      }
      .ds-switcher__dot {
        inline-size: 10px;
        block-size: 10px;
        border-radius: var(--ds-radius-pill);
        background: var(--ds-color-action-primary);
        box-shadow: inset 0 0 0 2px var(--ds-color-bg-surface);
      }
    `,
  ],
})
export class DsBrandThemeSwitcherComponent {
  protected readonly theme = inject(BrandThemeService);

  readonly layout = input<'inline' | 'stacked'>('inline');

  protected setBrand(brand: Brand): void {
    this.theme.setBrand(brand);
  }

  protected titleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
