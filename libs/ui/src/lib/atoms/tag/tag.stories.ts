import type { Meta, StoryObj } from '@storybook/angular';
import { DsTagComponent } from './tag.component';

type TagArgs = DsTagComponent & { label: string };

const meta: Meta<TagArgs> = {
  title: 'Atoms/Tag',
  component: DsTagComponent,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
    },
  },
  args: { label: 'Online', tone: 'success', closable: false },
  render: ({ label, ...args }) => ({
    props: args,
    template: `<ds-tag [tone]="tone" [closable]="closable">${label}</ds-tag>`,
  }),
};
export default meta;

type Story = StoryObj<TagArgs>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <ds-tag tone="neutral">Neutral</ds-tag>
        <ds-tag tone="brand">Brand</ds-tag>
        <ds-tag tone="success">Success</ds-tag>
        <ds-tag tone="warning">Warning</ds-tag>
        <ds-tag tone="danger">Danger</ds-tag>
        <ds-tag tone="info">Info</ds-tag>
      </div>
    `,
  }),
};
