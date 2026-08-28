import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DsSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Indeterminate loading indicator. Pure CSS + tokens (no ng-zorro dependency)
 * so it is safe to use inside any atom, including the button.
 */
@Component({
  selector: 'ds-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.role]': '"status"',
    '[attr.aria-label]': 'label()',
  },
  template: `<span class="ds-spinner__ring"></span>`,
  styles: [
    `
      :host {
        display: inline-flex;
        color: var(--ds-color-action-primary);
      }
      .ds-spinner__ring {
        display: block;
        border-radius: var(--ds-radius-pill);
        border: 2px solid color-mix(in srgb, currentColor 25%, transparent);
        border-top-color: currentColor;
        animation: ds-spinner-rotate var(--ds-motion-duration-slow) linear infinite;
      }
      :host([data-size='sm']) .ds-spinner__ring {
        inline-size: var(--ds-size-icon-sm);
        block-size: var(--ds-size-icon-sm);
      }
      :host([data-size='md']) .ds-spinner__ring {
        inline-size: var(--ds-size-icon-md);
        block-size: var(--ds-size-icon-md);
      }
      :host([data-size='lg']) .ds-spinner__ring {
        inline-size: var(--ds-size-icon-lg);
        block-size: var(--ds-size-icon-lg);
        border-width: 3px;
      }
      @keyframes ds-spinner-rotate {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .ds-spinner__ring {
          animation-duration: 1.6s;
        }
      }
    `,
  ],
})
export class DsSpinnerComponent {
  readonly size = input<DsSpinnerSize>('md');
  readonly label = input<string>('Loading');
}
