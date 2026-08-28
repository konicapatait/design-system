import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Live view of the generated CSS custom properties. Change the toolbar
 * Brand / Scheme and every swatch below updates — proof that the tokens,
 * not the components, carry the branding.
 */
const meta: Meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

const swatch = (name: string) => `
  <div style="display:flex;flex-direction:column;gap:6px">
    <div style="height:56px;border-radius:var(--ds-radius-md);
                border:1px solid var(--ds-color-border-subtle);
                background:var(--ds-color-${name})"></div>
    <code style="font:12px/1.4 var(--ds-font-family-mono);color:var(--ds-color-text-tertiary)">--ds-color-${name}</code>
  </div>`;

export const Colours: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px">
        ${[
          'brand-500',
          'brand-700',
          'action-primary',
          'action-primary-hover',
          'bg-canvas',
          'bg-surface',
          'bg-subtle',
          'text-primary',
          'border-default',
          'feedback-success-fg',
          'feedback-warning-fg',
          'feedback-danger-fg',
        ]
          .map(swatch)
          .join('')}
      </div>
    `,
  }),
};

export const Spacing: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          .map(
            (n) => `
          <div style="display:flex;align-items:center;gap:12px">
            <code style="width:90px;font:12px/1 var(--ds-font-family-mono);color:var(--ds-color-text-tertiary)">--ds-space-${n}</code>
            <div style="height:16px;width:var(--ds-space-${n});background:var(--ds-color-action-primary);border-radius:2px"></div>
          </div>`,
          )
          .join('')}
      </div>
    `,
  }),
};

export const Radius: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:20px;flex-wrap:wrap">
        ${['sm', 'md', 'lg', 'xl', 'pill']
          .map(
            (r) => `
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center">
            <div style="width:88px;height:64px;background:var(--ds-color-bg-subtle);
                        border:1px solid var(--ds-color-border-default);
                        border-radius:var(--ds-radius-${r})"></div>
            <code style="font:12px/1 var(--ds-font-family-mono);color:var(--ds-color-text-tertiary)">--ds-radius-${r}</code>
          </div>`,
          )
          .join('')}
      </div>
    `,
  }),
};
