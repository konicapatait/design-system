import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
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
import { provideBrandTheme } from '@brand/theme';
import { appRoutes } from './app.routes';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimations(),
    provideNzI18n(en_US),
    provideNzIcons(icons),
    provideBrandTheme(),
  ],
};
