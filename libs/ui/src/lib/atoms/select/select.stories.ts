import type { Meta, StoryObj } from '@storybook/angular';
import { DsSelectComponent } from './select.component';

const options = [
  { label: 'Online', value: 'online' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Offline', value: 'offline' },
  { label: 'Retired', value: 'retired', disabled: true },
];

const meta: Meta<DsSelectComponent> = {
  title: 'Atoms/Select',
  component: DsSelectComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    status: { control: 'inline-radio', options: ['default', 'error', 'warning'] },
  },
  args: {
    options,
    placeholder: 'Filter by status…',
    size: 'md',
    status: 'default',
    clearable: true,
    searchable: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:280px">
        <ds-select
          [options]="options"
          [placeholder]="placeholder"
          [size]="size"
          [status]="status"
          [clearable]="clearable"
          [searchable]="searchable"
        />
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<DsSelectComponent>;

export const Playground: Story = {};
