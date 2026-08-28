import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

export type DsIconSize = 'sm' | 'md' | 'lg' | 'inherit';

/**
 * Thin wrapper over `nz-icon` that constrains sizing to the icon scale tokens
 * and defaults to `aria-hidden` (icons are decorative unless given a label).
 */
@Component({
  selector: 'ds-icon',
  standalone: true,
  imports: [NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
  template: `
    <nz-icon
      [nzType]="name()"
      [nzTheme]="theme()"
      [nzSpin]="spin()"
      class="ds-icon__glyph"
    />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
        color: currentColor;
      }
      :host([data-size='sm']) .ds-icon__glyph {
        font-size: var(--ds-size-icon-sm);
      }
      :host([data-size='md']) .ds-icon__glyph {
        font-size: var(--ds-size-icon-md);
      }
      :host([data-size='lg']) .ds-icon__glyph {
        font-size: var(--ds-size-icon-lg);
      }
      :host([data-size='inherit']) .ds-icon__glyph {
        font-size: 1em;
      }
    `,
  ],
})
export class DsIconComponent {
  /** ng-zorro / Ant Design icon name, e.g. `check-circle`. */
  readonly name = input.required<string>();
  /** Icon theme. */
  readonly theme = input<'outline' | 'fill' | 'twotone'>('outline');
  readonly size = input<DsIconSize>('md');
  readonly spin = input(false, { transform: booleanAttribute });
  /** When set, the icon is exposed to assistive tech with this name. */
  readonly label = input<string | null>(null);
}
