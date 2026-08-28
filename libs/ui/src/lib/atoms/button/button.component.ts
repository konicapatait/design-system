import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DsSpinnerComponent } from '../spinner/spinner.component';

export type DsButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'danger';
export type DsButtonSize = 'sm' | 'md' | 'lg';
export type DsButtonType = 'button' | 'submit' | 'reset';

/**
 * Primary action control and the reference implementation every other atom
 * follows: standalone, `OnPush`, signal `input()` / `output()`, variants via
 * `data-*` host attributes, styles driven only by `--ds-*` tokens, explicit
 * a11y.
 *
 * It is a native `<button>` rather than a wrapper over `nz-button` on purpose —
 * ng-zorro's compiled `.ant-btn-*` rules are higher specificity and hard-code
 * the base Ant palette, which would defeat runtime brand switching. ng-zorro is
 * still the base for controls where its behaviour matters (`ds-select`).
 */
@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [NzIconModule, DsSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-block]': 'block() ? "" : null',
  },
  template: `
    <button
      class="ds-btn"
      [attr.type]="nativeType()"
      [disabled]="disabled() || loading()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-busy]="loading() ? 'true' : null"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <ds-spinner size="sm" class="ds-btn__spinner" />
      } @else if (iconStart()) {
        <nz-icon [nzType]="iconStart()!" />
      }
      <span class="ds-btn__label"><ng-content /></span>
      @if (iconEnd() && !loading()) {
        <nz-icon [nzType]="iconEnd()!" />
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        max-width: 100%;
      }
      :host([data-block]) {
        display: flex;
        width: 100%;
      }

      .ds-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ds-space-3);
        width: 100%;
        border: var(--ds-border-width-hair) solid transparent;
        border-radius: var(--ds-radius-md);
        font-family: var(--ds-font-family-base);
        font-weight: var(--ds-font-weight-medium);
        line-height: 1;
        cursor: pointer;
        transition:
          background-color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard),
          border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard),
          color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
      }

      :host([data-size='sm']) .ds-btn {
        min-height: var(--ds-size-control-sm);
        padding-inline: var(--ds-space-4);
        font-size: var(--ds-font-size-sm);
      }
      :host([data-size='md']) .ds-btn {
        min-height: var(--ds-size-control-md);
        padding-inline: var(--ds-space-5);
        font-size: var(--ds-font-size-md);
      }
      :host([data-size='lg']) .ds-btn {
        min-height: var(--ds-size-control-lg);
        padding-inline: var(--ds-space-7);
        font-size: var(--ds-font-size-lg);
      }

      :host([data-variant='primary']) .ds-btn {
        background-color: var(--ds-color-action-primary);
        border-color: var(--ds-color-action-primary);
        color: var(--ds-color-action-primary-contrast);
      }
      :host([data-variant='primary']) .ds-btn:not(:disabled):hover {
        background-color: var(--ds-color-action-primary-hover);
        border-color: var(--ds-color-action-primary-hover);
      }
      :host([data-variant='primary']) .ds-btn:not(:disabled):active {
        background-color: var(--ds-color-action-primary-active);
        border-color: var(--ds-color-action-primary-active);
      }

      :host([data-variant='secondary']) .ds-btn {
        background-color: var(--ds-color-action-secondary);
        border-color: var(--ds-color-border-default);
        color: var(--ds-color-action-secondary-contrast);
      }
      :host([data-variant='secondary']) .ds-btn:not(:disabled):hover {
        background-color: var(--ds-color-action-secondary-hover);
        border-color: var(--ds-color-border-strong);
      }

      :host([data-variant='ghost']) .ds-btn {
        background-color: transparent;
        border-color: var(--ds-color-action-primary);
        color: var(--ds-color-action-primary);
      }
      :host([data-variant='ghost']) .ds-btn:not(:disabled):hover {
        background-color: var(--ds-color-action-primary-subtle);
      }

      :host([data-variant='link']) .ds-btn {
        background-color: transparent;
        color: var(--ds-color-text-link);
        padding-inline: var(--ds-space-2);
      }
      :host([data-variant='link']) .ds-btn:not(:disabled):hover {
        color: var(--ds-color-text-link-hover);
        text-decoration: underline;
      }

      :host([data-variant='danger']) .ds-btn {
        background-color: var(--ds-color-feedback-danger-fg);
        border-color: var(--ds-color-feedback-danger-fg);
        color: var(--ds-color-action-primary-contrast);
      }
      :host([data-variant='danger']) .ds-btn:not(:disabled):hover {
        filter: brightness(0.94);
      }

      .ds-btn:disabled {
        cursor: not-allowed;
        background-color: var(--ds-color-action-disabled-bg);
        border-color: var(--ds-color-action-disabled-bg);
        color: var(--ds-color-action-disabled-fg);
      }
      :host([data-variant='ghost']) .ds-btn:disabled,
      :host([data-variant='link']) .ds-btn:disabled {
        background-color: transparent;
        border-color: transparent;
      }

      .ds-btn:focus-visible {
        outline: var(--ds-border-width-thick) solid var(--ds-color-border-focus);
        outline-offset: 2px;
      }

      .ds-btn__label:empty {
        display: none;
      }
      .ds-btn__spinner {
        color: currentColor;
      }
    `,
  ],
})
export class DsButtonComponent {
  readonly variant = input<DsButtonVariant>('primary');
  readonly size = input<DsButtonSize>('md');
  readonly nativeType = input<DsButtonType>('button');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly block = input(false, { transform: booleanAttribute });
  readonly iconStart = input<string | null>(null);
  readonly iconEnd = input<string | null>(null);
  /** Accessible name; required when the button has no text content. */
  readonly ariaLabel = input<string | null>(null);

  readonly clicked = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
