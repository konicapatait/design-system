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
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface DsSelectOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type DsSelectSize = 'sm' | 'md' | 'lg';
export type DsSelectStatus = 'default' | 'error' | 'warning';

/**
 * Single-choice dropdown. Wraps `nz-select`, implements
 * `ControlValueAccessor`, and inherits the ng-zorro popup styling from the
 * token-driven `@brand/theme` Less compile — so no bespoke popup CSS here.
 */
@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [NzSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-status]': 'status()',
  },
  template: `
    <nz-select
      class="ds-select__control"
      [nzPlaceHolder]="placeholder()"
      [nzDisabled]="disabled()"
      [nzAllowClear]="clearable()"
      [nzShowSearch]="searchable()"
      [nzSize]="nzSize()"
      [nzStatus]="nzStatus()"
      [ngModel]="value()"
      (ngModelChange)="handleChange($event)"
      (nzBlur)="onTouched()"
    >
      @for (opt of options(); track opt.value) {
        <nz-option
          [nzValue]="opt.value"
          [nzLabel]="opt.label"
          [nzDisabled]="opt.disabled ?? false"
        />
      }
    </nz-select>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ds-select__control {
        width: 100%;
      }
      :host([data-size='sm']) {
        font-size: var(--ds-font-size-sm);
      }
      :host([data-size='lg']) {
        font-size: var(--ds-font-size-lg);
      }
    `,
  ],
})
export class DsSelectComponent<T = unknown> implements ControlValueAccessor {
  readonly options = input<DsSelectOption<T>[]>([]);
  readonly value = model<T | null>(null);
  readonly placeholder = input<string>('Select…');
  readonly size = input<DsSelectSize>('md');
  readonly status = input<DsSelectStatus>('default');
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly searchable = input(false, { transform: booleanAttribute });

  readonly valueChange = output<T | null>();

  protected readonly disabled = signal(false);

  protected nzSize(): 'small' | 'default' | 'large' {
    return this.size() === 'sm'
      ? 'small'
      : this.size() === 'lg'
        ? 'large'
        : 'default';
  }

  protected nzStatus(): '' | 'error' | 'warning' {
    const status = this.status();
    return status === 'default' ? '' : status;
  }

  private onChange: (value: T | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected handleChange(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
