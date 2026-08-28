import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type DsTextVariant =
  | 'display'
  | 'title-lg'
  | 'title'
  | 'title-sm'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'code';
export type DsTextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'brand'
  | 'danger'
  | 'success';
export type DsTextElement =
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'div';

const HEADING_LEVEL: Record<string, number> = {
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
};

/**
 * The one typographic primitive. Size / weight / colour all come from the type
 * + colour tokens. Content is projected straight into the host (no inner
 * element / control-flow), and `element` only drives semantics: for `h1`–`h6`
 * the host is exposed as an ARIA heading of the matching level.
 */
@Component({
  selector: 'ds-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-tone]': 'tone()',
    '[attr.role]': 'role()',
    '[attr.aria-level]': 'ariaLevel()',
  },
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: block;
        margin: 0;
        font-family: var(--ds-font-family-base);
        color: var(--ds-color-text-primary);
      }
      :host([data-variant='body-sm']),
      :host([data-variant='caption']),
      :host([data-variant='code']) {
        display: inline-block;
      }

      :host([data-tone='secondary']) { color: var(--ds-color-text-secondary); }
      :host([data-tone='tertiary']) { color: var(--ds-color-text-tertiary); }
      :host([data-tone='inverse']) { color: var(--ds-color-text-inverse); }
      :host([data-tone='brand']) { color: var(--ds-color-action-primary); }
      :host([data-tone='danger']) { color: var(--ds-color-feedback-danger-fg); }
      :host([data-tone='success']) { color: var(--ds-color-feedback-success-fg); }

      :host([data-variant='display']) {
        font-size: var(--ds-font-size-4xl);
        line-height: var(--ds-font-line-height-tight);
        font-weight: var(--ds-font-weight-bold);
        letter-spacing: var(--ds-font-letter-spacing-tight);
      }
      :host([data-variant='title-lg']) {
        font-size: var(--ds-font-size-3xl);
        line-height: var(--ds-font-line-height-tight);
        font-weight: var(--ds-font-weight-semibold);
      }
      :host([data-variant='title']) {
        font-size: var(--ds-font-size-2xl);
        line-height: var(--ds-font-line-height-snug);
        font-weight: var(--ds-font-weight-semibold);
      }
      :host([data-variant='title-sm']) {
        font-size: var(--ds-font-size-xl);
        line-height: var(--ds-font-line-height-snug);
        font-weight: var(--ds-font-weight-semibold);
      }
      :host([data-variant='body-lg']) {
        font-size: var(--ds-font-size-lg);
        line-height: var(--ds-font-line-height-relaxed);
      }
      :host([data-variant='body']) {
        font-size: var(--ds-font-size-md);
        line-height: var(--ds-font-line-height-normal);
      }
      :host([data-variant='body-sm']) {
        font-size: var(--ds-font-size-sm);
        line-height: var(--ds-font-line-height-normal);
      }
      :host([data-variant='caption']) {
        font-size: var(--ds-font-size-xs);
        line-height: var(--ds-font-line-height-normal);
        color: var(--ds-color-text-tertiary);
      }
      :host([data-variant='code']) {
        font-family: var(--ds-font-family-mono);
        font-size: var(--ds-font-size-sm);
        background: var(--ds-color-bg-subtle);
        border-radius: var(--ds-radius-sm);
        padding: 2px var(--ds-space-2);
      }
    `,
  ],
})
export class DsTextComponent {
  readonly variant = input<DsTextVariant>('body');
  readonly tone = input<DsTextTone>('primary');
  /** Semantic intent. `h1`–`h6` expose the host as an ARIA heading. */
  readonly element = input<DsTextElement>('p');

  protected readonly role = computed(() =>
    HEADING_LEVEL[this.element()] ? 'heading' : null,
  );
  protected readonly ariaLevel = computed(
    () => HEADING_LEVEL[this.element()] ?? null,
  );
}
