import type { Meta, StoryObj } from '@storybook/angular';
import { DsButtonComponent } from './button.component';

type ButtonArgs = DsButtonComponent & { label: string };

const meta: Meta<ButtonArgs> = {
  title: 'Atoms/Button',
  component: DsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'link', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconStart: { control: 'text' },
    iconEnd: { control: 'text' },
  },
  args: {
    label: 'Add device',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
  },
  render: ({ label, ...args }) => ({
    props: args,
    template: `
      <ds-button
        [variant]="variant"
        [size]="size"
        [loading]="loading"
        [disabled]="disabled"
        [block]="block"
        [iconStart]="iconStart || null"
        [iconEnd]="iconEnd || null"
      >${label}</ds-button>
    `,
  }),
};
export default meta;

type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <ds-button variant="primary">Primary</ds-button>
        <ds-button variant="secondary">Secondary</ds-button>
        <ds-button variant="ghost">Ghost</ds-button>
        <ds-button variant="link">Link</ds-button>
        <ds-button variant="danger">Danger</ds-button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center">
        <ds-button size="sm">Small</ds-button>
        <ds-button size="md">Medium</ds-button>
        <ds-button size="lg">Large</ds-button>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:12px;align-items:center">
        <ds-button iconStart="plus">With icon</ds-button>
        <ds-button [loading]="true">Loading</ds-button>
        <ds-button [disabled]="true">Disabled</ds-button>
      </div>
    `,
  }),
};
