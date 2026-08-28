import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

export type DsInputSize = 'sm' | 'md' | 'lg';
export type DsInputStatus = 'default' | 'error' | 'warning' | 'success';

/**
 * Single-line text field. Wraps `input[nz-input]`, implements
 * `ControlValueAccessor` so it drops into template- and reactive forms, and
 * renders its own token-driven border / focus / status treatment.
 */
@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [NzInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsInputComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-status]': 'status()',
  },
  template: `
    <span class="ds-input__wrap">
      @if (prefixIcon()) {
        <span class="ds-input__affix ds-input__affix--prefix">
          <ng-content select="[dsInputPrefix]" />
        </span>
      }
      <input
        nz-input
        class="ds-input__control"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [readOnly]="readOnly()"
        [attr.inputmode]="inputMode() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.aria-invalid]="status() === 'error' ? 'true' : null"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      @if (suffixIcon()) {
        <span class="ds-input__affix ds-input__affix--suffix">
          <ng-content select="[dsInputSuffix]" />
        </span>
      }
    </span>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ds-input__wrap {
        display: flex;
        align-items: center;
        gap: var(--ds-space-3);
        background: var(--ds-color-bg-surface);
        border: var(--ds-border-width-hair) solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-md);
        padding-inline: var(--ds-space-4);
        transition:
          border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard),
          box-shadow var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
      }
      .ds-input__wrap:focus-within {
        border-color: var(--ds-color-border-focus);
        box-shadow: 0 0 0 var(--ds-focus-ring-width) var(--ds-focus-ring-color);
      }
      :host([data-status='error']) .ds-input__wrap {
        border-color: var(--ds-color-feedback-danger-fg);
      }
      :host([data-status='warning']) .ds-input__wrap {
        border-color: var(--ds-color-feedback-warning-fg);
      }
      :host([data-status='success']) .ds-input__wrap {
        border-color: var(--ds-color-feedback-success-fg);
      }
      .ds-input__control {
        flex: 1 1 auto;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        padding: 0;
        color: var(--ds-color-text-primary);
        font-family: var(--ds-font-family-base);
      }
      .ds-input__control::placeholder {
        color: var(--ds-color-text-tertiary);
      }
      .ds-input__control:disabled {
        cursor: not-allowed;
        color: var(--ds-color-text-disabled);
      }
      :host([data-size='sm']) .ds-input__wrap {
        min-height: var(--ds-size-control-sm);
        font-size: var(--ds-font-size-sm);
      }
      :host([data-size='md']) .ds-input__wrap {
        min-height: var(--ds-size-control-md);
        font-size: var(--ds-font-size-md);
      }
      :host([data-size='lg']) .ds-input__wrap {
        min-height: var(--ds-size-control-lg);
        font-size: var(--ds-font-size-lg);
      }
      .ds-input__affix {
        display: inline-flex;
        align-items: center;
        color: var(--ds-color-text-tertiary);
      }
    `,
  ],
})
export class DsInputComponent implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'search' | 'tel' | 'url'>(
    'text',
  );
  readonly size = input<DsInputSize>('md');
  readonly status = input<DsInputStatus>('default');
  readonly placeholder = input<string>('');
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly inputMode = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly prefixIcon = input(false, { transform: booleanAttribute });
  readonly suffixIcon = input(false, { transform: booleanAttribute });

  readonly valueChange = output<string>();
  readonly blurred = output<void>();

  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  protected onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
