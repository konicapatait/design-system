import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

let uid = 0;

/**
 * Layout + a11y wrapper around a single form control.
 *
 * Wire the control with the exposed ids:
 *   <ds-form-field label="Email" hint="We never share it." #f>
 *     <ds-input [attr.id]="f.controlId" [attr.aria-describedby]="f.describedBy" />
 *   </ds-form-field>
 */
@Component({
  selector: 'ds-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-invalid]': 'invalid() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  template: `
    <div class="ds-field">
      @if (label()) {
        <label class="ds-field__label" [attr.for]="controlId">
          {{ label() }}
          @if (required()) {
            <span class="ds-field__required" aria-hidden="true">*</span>
          }
          @if (optional() && !required()) {
            <span class="ds-field__optional">(optional)</span>
          }
        </label>
      }

      <div class="ds-field__control">
        <ng-content />
      </div>

      @if (invalid() && error()) {
        <p class="ds-field__message ds-field__message--error" [id]="errorId" role="alert">
          {{ error() }}
        </p>
      } @else if (hint()) {
        <p class="ds-field__message ds-field__message--hint" [id]="hintId">
          {{ hint() }}
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ds-field {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-3);
      }
      .ds-field__label {
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-medium);
        color: var(--ds-color-text-secondary);
        display: inline-flex;
        align-items: baseline;
        gap: var(--ds-space-2);
      }
      .ds-field__required {
        color: var(--ds-color-feedback-danger-fg);
      }
      .ds-field__optional {
        color: var(--ds-color-text-tertiary);
        font-weight: var(--ds-font-weight-regular);
      }
      .ds-field__message {
        margin: 0;
        font-size: var(--ds-font-size-xs);
      }
      .ds-field__message--hint {
        color: var(--ds-color-text-tertiary);
      }
      .ds-field__message--error {
        color: var(--ds-color-feedback-danger-fg);
      }
    `,
  ],
})
export class DsFormFieldComponent {
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly seq = uid++;
  readonly controlId = `ds-field-${this.seq}`;
  readonly hintId = `ds-field-${this.seq}-hint`;
  readonly errorId = `ds-field-${this.seq}-error`;

  /** Feed this into the control's `aria-describedby`. */
  readonly describedBy = computed(() =>
    this.invalid() && this.error()
      ? this.errorId
      : this.hint()
        ? this.hintId
        : null,
  );
}
