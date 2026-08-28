import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DsFormFieldComponent } from './form-field.component';
import { DsInputComponent } from '../../atoms/input/input.component';

const meta: Meta<DsFormFieldComponent> = {
  title: 'Molecules/Form field',
  component: DsFormFieldComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [DsInputComponent] })],
  args: {
    label: 'Work email',
    hint: 'We only use this for device alerts.',
    error: 'Enter a valid email address.',
    required: true,
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:360px">
        <ds-form-field
          [label]="label"
          [hint]="hint"
          [error]="error"
          [required]="required"
          [invalid]="invalid"
          #field
        >
          <ds-input
            placeholder="name@company.com"
            [status]="invalid ? 'error' : 'default'"
          />
        </ds-form-field>
      </div>
    `,
  }),
};
export default meta;

type Story = StoryObj<DsFormFieldComponent>;

export const Valid: Story = {};
export const Invalid: Story = { args: { invalid: true } };
