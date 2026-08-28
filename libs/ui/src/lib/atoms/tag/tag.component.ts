import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type DsTagTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/**
 * Compact status / metadata label. Wraps `nz-tag`; the tone maps to the
 * feedback + brand token families so tags stay on-brand in every theme.
 */
@Component({
  selector: 'ds-tag',
  standalone: true,
  imports: [NzTagModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-tone]': 'tone()' },
  template: `
    <nz-tag
      [nzMode]="closable() ? 'closeable' : 'default'"
      (nzOnClose)="closed.emit()"
      class="ds-tag__body"
    >
      @if (icon()) {
        <nz-icon [nzType]="icon()!" />
      }
      <ng-content />
    </nz-tag>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }
      .ds-tag__body {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
        margin: 0;
        border-radius: var(--ds-radius-sm);
        border-width: var(--ds-border-width-hair);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-medium);
        padding-block: 2px;
        padding-inline: var(--ds-space-3);
      }
      :host([data-tone='neutral']) .ds-tag__body {
        background: var(--ds-color-bg-subtle);
        border-color: var(--ds-color-border-default);
        color: var(--ds-color-text-secondary);
      }
      :host([data-tone='brand']) .ds-tag__body {
        background: var(--ds-color-action-primary-subtle);
        border-color: var(--ds-color-brand-300);
        color: var(--ds-color-action-primary);
      }
      :host([data-tone='success']) .ds-tag__body {
        background: var(--ds-color-feedback-success-bg);
        border-color: var(--ds-color-feedback-success-border);
        color: var(--ds-color-feedback-success-fg);
      }
      :host([data-tone='warning']) .ds-tag__body {
        background: var(--ds-color-feedback-warning-bg);
        border-color: var(--ds-color-feedback-warning-border);
        color: var(--ds-color-feedback-warning-fg);
      }
      :host([data-tone='danger']) .ds-tag__body {
        background: var(--ds-color-feedback-danger-bg);
        border-color: var(--ds-color-feedback-danger-border);
        color: var(--ds-color-feedback-danger-fg);
      }
      :host([data-tone='info']) .ds-tag__body {
        background: var(--ds-color-feedback-info-bg);
        border-color: var(--ds-color-feedback-info-border);
        color: var(--ds-color-feedback-info-fg);
      }
    `,
  ],
})
export class DsTagComponent {
  readonly tone = input<DsTagTone>('neutral');
  readonly icon = input<string | null>(null);
  readonly closable = input(false, { transform: booleanAttribute });

  readonly closed = output<void>();
}
