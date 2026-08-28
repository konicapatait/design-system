import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type DsAlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<DsAlertTone, string> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'exclamation-circle',
  danger: 'close-circle',
};

/**
 * Inline feedback banner. Token-driven surface / border / foreground per tone,
 * optional dismiss, `role="alert"` for assertive tones.
 */
@Component({
  selector: 'ds-alert',
  standalone: true,
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.role]': 'tone() === "danger" || tone() === "warning" ? "alert" : "status"',
    '[hidden]': 'dismissed()',
  },
  template: `
    <nz-icon class="ds-alert__icon" [nzType]="icon()" nzTheme="outline" />
    <div class="ds-alert__content">
      @if (title()) {
        <p class="ds-alert__title">{{ title() }}</p>
      }
      <div class="ds-alert__body"><ng-content /></div>
    </div>
    @if (closable()) {
      <button
        type="button"
        class="ds-alert__close"
        aria-label="Dismiss"
        (click)="dismiss()"
      >
        <nz-icon nzType="close" />
      </button>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: var(--ds-space-4);
        padding: var(--ds-space-4) var(--ds-space-5);
        border: var(--ds-border-width-hair) solid transparent;
        border-radius: var(--ds-radius-md);
        font-size: var(--ds-font-size-sm);
      }
      :host([data-tone='info']) {
        background: var(--ds-color-feedback-info-bg);
        border-color: var(--ds-color-feedback-info-border);
        color: var(--ds-color-feedback-info-fg);
      }
      :host([data-tone='success']) {
        background: var(--ds-color-feedback-success-bg);
        border-color: var(--ds-color-feedback-success-border);
        color: var(--ds-color-feedback-success-fg);
      }
      :host([data-tone='warning']) {
        background: var(--ds-color-feedback-warning-bg);
        border-color: var(--ds-color-feedback-warning-border);
        color: var(--ds-color-feedback-warning-fg);
      }
      :host([data-tone='danger']) {
        background: var(--ds-color-feedback-danger-bg);
        border-color: var(--ds-color-feedback-danger-border);
        color: var(--ds-color-feedback-danger-fg);
      }
      .ds-alert__icon {
        font-size: var(--ds-size-icon-md);
        margin-top: 2px;
      }
      .ds-alert__content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-1);
      }
      .ds-alert__title {
        margin: 0;
        font-weight: var(--ds-font-weight-semibold);
      }
      .ds-alert__body {
        color: var(--ds-color-text-secondary);
      }
      .ds-alert__close {
        border: 0;
        background: transparent;
        color: inherit;
        cursor: pointer;
        line-height: 0;
        padding: var(--ds-space-1);
        border-radius: var(--ds-radius-sm);
      }
      .ds-alert__close:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      .ds-alert__close:focus-visible {
        outline: var(--ds-border-width-thick) solid var(--ds-color-border-focus);
        outline-offset: 1px;
      }
    `,
  ],
})
export class DsAlertComponent {
  readonly tone = input<DsAlertTone>('info');
  readonly title = input<string>('');
  readonly closable = input(false, { transform: booleanAttribute });

  readonly closed = output<void>();

  protected readonly dismissed = signal(false);

  protected icon(): string {
    return ICONS[this.tone()];
  }

  protected dismiss(): void {
    this.dismissed.set(true);
    this.closed.emit();
  }
}
