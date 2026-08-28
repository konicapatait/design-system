import type { Meta, StoryObj } from '@storybook/angular';
import { DsAlertComponent } from './alert.component';

type AlertArgs = DsAlertComponent & { body: string };

const meta: Meta<AlertArgs> = {
  title: 'Molecules/Alert',
  component: DsAlertComponent,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
  },
  args: {
    tone: 'info',
    title: 'Firmware',
    closable: true,
    body: '7 devices are eligible for the 4.2.1 rollout.',
  },
  render: ({ body, ...args }) => ({
    props: args,
    template: `<ds-alert [tone]="tone" [title]="title" [closable]="closable">${body}</ds-alert>`,
  }),
};
export default meta;

type Story = StoryObj<AlertArgs>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:520px">
        <ds-alert tone="info" title="Info">Background sync finished.</ds-alert>
        <ds-alert tone="success" title="Success">Firmware applied to 6 devices.</ds-alert>
        <ds-alert tone="warning" title="Warning">2 devices are on an old release.</ds-alert>
        <ds-alert tone="danger" title="Error">1 device failed to reconnect.</ds-alert>
      </div>
    `,
  }),
};
