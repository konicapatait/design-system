import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type DsCardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Surface container for grouped content. Deliberately not a wrapper over
 * `nz-card` — it is a small amount of tokenised structure (surface colour,
 * radius, elevation, optional header / footer slots) that composes cleanly
 * with any content, including ng-zorro widgets.
 */
@Component({
  selector: 'ds-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-padding]': 'padding()',
    '[attr.data-interactive]': 'interactive() ? "" : null',
  },
  template: `
    @if (heading() || hasHeaderSlot) {
      <header class="ds-card__header">
        @if (heading()) {
          <h3 class="ds-card__heading">{{ heading() }}</h3>
        }
        <div class="ds-card__header-actions">
          <ng-content select="[dsCardActions]" />
        </div>
      </header>
    }

    <div class="ds-card__body">
      <ng-content />
    </div>

    <div class="ds-card__footer">
      <ng-content select="[dsCardFooter]" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--ds-color-bg-surface);
        border: var(--ds-border-width-hair) solid var(--ds-color-border-subtle);
        border-radius: var(--ds-radius-lg);
        box-shadow: var(--ds-elevation-1);
        color: var(--ds-color-text-primary);
        overflow: clip;
      }
      :host([data-interactive]) {
        transition:
          box-shadow var(--ds-motion-duration-base) var(--ds-motion-easing-standard),
          transform var(--ds-motion-duration-base) var(--ds-motion-easing-standard);
        cursor: pointer;
      }
      :host([data-interactive]:hover) {
        box-shadow: var(--ds-elevation-3);
        transform: translateY(-2px);
      }
      .ds-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-4);
        padding: var(--ds-space-5) var(--ds-space-6);
        border-bottom: var(--ds-border-width-hair) solid var(--ds-color-border-subtle);
      }
      .ds-card__heading {
        margin: 0;
        font-size: var(--ds-font-size-lg);
        font-weight: var(--ds-font-weight-semibold);
      }
      :host([data-padding='none']) .ds-card__body { padding: 0; }
      :host([data-padding='sm']) .ds-card__body { padding: var(--ds-space-4); }
      :host([data-padding='md']) .ds-card__body { padding: var(--ds-space-6); }
      :host([data-padding='lg']) .ds-card__body { padding: var(--ds-space-8); }
      .ds-card__footer:empty {
        display: none;
      }
      .ds-card__footer {
        padding: var(--ds-space-4) var(--ds-space-6);
        border-top: var(--ds-border-width-hair) solid var(--ds-color-border-subtle);
        background: var(--ds-color-bg-canvas);
      }
    `,
  ],
})
export class DsCardComponent {
  readonly heading = input<string>('');
  readonly padding = input<DsCardPadding>('md');
  readonly interactive = input(false, { transform: booleanAttribute });

  /** Set by consumers projecting `[dsCardActions]`; kept simple for the POC. */
  readonly hasHeaderSlot = false;
}
