import type { Meta, StoryObj } from '@storybook/angular';
import { DsInputComponent } from './input.component';

const meta: Meta<DsInputComponent> = {
  title: 'Atoms/Input',
  component: DsInputComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    status: {
      control: 'inline-radio',
      options: ['default', 'error', 'warning', 'success'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
  },
  args: {
    placeholder: 'name@company.com',
    size: 'md',
    status: 'default',
    type: 'text',
  },
};
export default meta;

type Story = StoryObj<DsInputComponent>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <ds-input size="sm" placeholder="Small" />
        <ds-input size="md" placeholder="Medium" />
        <ds-input size="lg" placeholder="Large" />
      </div>
    `,
  }),
};

export const Statuses: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <ds-input status="default" placeholder="Default" />
        <ds-input status="success" placeholder="Success" />
        <ds-input status="warning" placeholder="Warning" />
        <ds-input status="error" placeholder="Error" />
      </div>
    `,
  }),
};
