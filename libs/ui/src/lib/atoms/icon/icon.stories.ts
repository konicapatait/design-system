import type { Meta, StoryObj } from '@storybook/angular';
import { DsIconComponent } from './icon.component';

const meta: Meta<DsIconComponent> = {
  title: 'Atoms/Icon',
  component: DsIconComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'inherit'] },
    theme: { control: 'inline-radio', options: ['outline', 'fill', 'twotone'] },
  },
  args: { name: 'bell', size: 'md', theme: 'outline', spin: false },
};
export default meta;

type Story = StoryObj<DsIconComponent>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:16px;align-items:center;color:var(--ds-color-action-primary)">
        <ds-icon name="setting" size="sm" />
        <ds-icon name="setting" size="md" />
        <ds-icon name="setting" size="lg" />
      </div>
    `,
  }),
};
