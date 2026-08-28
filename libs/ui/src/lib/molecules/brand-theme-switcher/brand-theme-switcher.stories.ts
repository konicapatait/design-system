import type { Meta, StoryObj } from '@storybook/angular';
import { DsBrandThemeSwitcherComponent } from './brand-theme-switcher.component';

const meta: Meta<DsBrandThemeSwitcherComponent> = {
  title: 'Foundations/Brand theme switcher',
  component: DsBrandThemeSwitcherComponent,
  tags: ['autodocs'],
  argTypes: { layout: { control: 'inline-radio', options: ['inline', 'stacked'] } },
  args: { layout: 'inline' },
  parameters: {
    docs: {
      description: {
        component:
          'Drives `BrandThemeService`. It only toggles `data-brand` / `data-theme` on ' +
          '`<html>` — every token and ng-zorro surface follows with no re-render. ' +
          'Note: this control and the Storybook toolbar Brand/Scheme picker both write ' +
          'the same attributes, so they can fight; use one at a time.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<DsBrandThemeSwitcherComponent>;

export const Playground: Story = {};
