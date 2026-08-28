import { applicationConfig, type Decorator, type Preview } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  ArrowDownOutline,
  ArrowUpOutline,
  BellOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  CloseOutline,
  DownloadOutline,
  ExclamationCircleOutline,
  InfoCircleOutline,
  MoreOutline,
  PlusOutline,
  SearchOutline,
  SettingOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';

// The token layers (tokens.css, antd*.css, ng-zorro-tokens.css, base.css,
// preview.css) are injected via the `styles` array on the storybook targets in
// libs/ui/project.json — the same mechanism apps use — so a cross-project
// relative import is not needed here.

const icons = [
  ArrowDownOutline,
  ArrowUpOutline,
  BellOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  CloseOutline,
  DownloadOutline,
  ExclamationCircleOutline,
  InfoCircleOutline,
  MoreOutline,
  PlusOutline,
  SearchOutline,
  SettingOutline,
  UserOutline,
];

const withBrandTheme: Decorator = (story, context) => {
  const brand = context.globals['brand'] ?? 'konica';
  const scheme = context.globals['scheme'] ?? 'light';
  const root = document.documentElement;
  root.dataset['brand'] = brand;
  root.dataset['theme'] = scheme;
  root.style.colorScheme = scheme;
  return story();
};

const preview: Preview = {
  decorators: [
    withBrandTheme,
    applicationConfig({
      providers: [provideAnimations(), provideNzI18n(en_US), provideNzIcons(icons)],
    }),
  ],
  globalTypes: {
    brand: {
      description: 'Active brand',
      defaultValue: 'konica',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'konica', title: 'Konica' },
          { value: 'aurora', title: 'Aurora' },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: 'Colour scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Scheme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Foundations', 'Atoms', 'Molecules'],
      },
    },
  },
};

export default preview;
