import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DsCardComponent } from './card.component';
import { DsButtonComponent } from '../../atoms/button/button.component';
import { DsTextComponent } from '../../atoms/text/text.component';

const meta: Meta<DsCardComponent> = {
  title: 'Molecules/Card',
  component: DsCardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [DsButtonComponent, DsTextComponent] }),
  ],
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: { heading: 'Firmware rollout', padding: 'md', interactive: false },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px">
        <ds-card [heading]="heading" [padding]="padding" [interactive]="interactive">
          <ds-text variant="body" tone="secondary">
            4.2.1 is staged for 6 devices. Review the change list before you approve.
          </ds-text>
          <div dsCardFooter style="display:flex;gap:8px;justify-content:flex-end">
            <ds-button variant="link">Details</ds-button>
            <ds-button variant="primary" size="sm">Approve</ds-button>
          </div>
        </ds-card>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<DsCardComponent>;

export const Playground: Story = {};
export const Interactive: Story = { args: { interactive: true, heading: '' } };
