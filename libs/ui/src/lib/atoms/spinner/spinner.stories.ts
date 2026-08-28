import type { Meta, StoryObj } from '@storybook/angular';
import { DsSpinnerComponent } from './spinner.component';

const meta: Meta<DsSpinnerComponent> = {
  title: 'Atoms/Spinner',
  component: DsSpinnerComponent,
  tags: ['autodocs'],
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  args: { size: 'md', label: 'Loading' },
};
export default meta;

type Story = StoryObj<DsSpinnerComponent>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:20px;align-items:center">
        <ds-spinner size="sm" />
        <ds-spinner size="md" />
        <ds-spinner size="lg" />
      </div>
    `,
  }),
};
