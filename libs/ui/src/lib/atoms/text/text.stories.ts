import type { Meta, StoryObj } from '@storybook/angular';
import { DsTextComponent } from './text.component';

type TextArgs = DsTextComponent & { content: string };

const meta: Meta<TextArgs> = {
  title: 'Atoms/Text',
  component: DsTextComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display',
        'title-lg',
        'title',
        'title-sm',
        'body-lg',
        'body',
        'body-sm',
        'caption',
        'code',
      ],
    },
    tone: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'brand', 'danger', 'success'],
    },
    element: {
      control: 'select',
      options: ['p', 'span', 'h1', 'h2', 'h3', 'label', 'div'],
    },
  },
  args: { content: 'The quick brown fox', variant: 'body', tone: 'primary', element: 'p' },
  render: ({ content, ...args }) => ({
    props: args,
    template: `<ds-text [variant]="variant" [tone]="tone" [element]="element">${content}</ds-text>`,
  }),
};
export default meta;

type Story = StoryObj<TextArgs>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:8px">
        <ds-text variant="display" element="span">Display</ds-text>
        <ds-text variant="title-lg" element="span">Title large</ds-text>
        <ds-text variant="title" element="span">Title</ds-text>
        <ds-text variant="title-sm" element="span">Title small</ds-text>
        <ds-text variant="body-lg" element="span">Body large</ds-text>
        <ds-text variant="body" element="span">Body</ds-text>
        <ds-text variant="body-sm" element="span">Body small</ds-text>
        <ds-text variant="caption">Caption</ds-text>
        <ds-text variant="code">const brand = 'brand-1';</ds-text>
      </div>
    `,
  }),
};
