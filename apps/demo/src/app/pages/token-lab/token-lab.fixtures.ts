import type { DsSelectOption, DsTextVariant } from '@brand/ui';

/**
 * Stub test data for the Token Lab page — kept out of the component so it can
 * also be reused by specs / a future e2e harness.
 */

export const COLOR_ROLE_TOKENS = [
  'color-action-primary',
  'color-action-primary-hover',
  'color-action-primary-subtle',
  'color-action-secondary',
  'color-text-primary',
  'color-text-secondary',
  'color-text-link',
  'color-bg-canvas',
  'color-bg-surface',
  'color-bg-subtle',
  'color-border-default',
  'color-border-focus',
  'color-feedback-success-fg',
  'color-feedback-warning-fg',
  'color-feedback-danger-fg',
  'color-feedback-info-fg',
] as const;

export const BRAND_RAMP_TOKENS = [
  'color-brand-50',
  'color-brand-100',
  'color-brand-200',
  'color-brand-300',
  'color-brand-400',
  'color-brand-500',
  'color-brand-600',
  'color-brand-700',
  'color-brand-800',
  'color-brand-900',
] as const;

export const SPACE_TOKENS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => `space-${n}`);
export const RADIUS_TOKENS = ['sm', 'md', 'lg', 'xl', 'pill'].map((r) => `radius-${r}`);
export const ELEVATION_TOKENS = ['1', '2', '3', '4'].map((e) => `elevation-${e}`);

export const TYPE_SPECIMENS: { variant: DsTextVariant; label: string }[] = [
  { variant: 'display', label: 'Display' },
  { variant: 'title-lg', label: 'Title large' },
  { variant: 'title', label: 'Title' },
  { variant: 'title-sm', label: 'Title small' },
  { variant: 'body-lg', label: 'Body large' },
  { variant: 'body', label: 'Body' },
  { variant: 'body-sm', label: 'Body small' },
  { variant: 'caption', label: 'Caption' },
];

export const SELECT_OPTIONS: DsSelectOption<string>[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical (locked)', value: 'critical', disabled: true },
];

export interface LabRow {
  id: string;
  name: string;
  tone: 'success' | 'warning' | 'danger';
  status: string;
}

export const TABLE_ROWS: LabRow[] = [
  { id: 'R-01', name: 'Integration check A', tone: 'success', status: 'Passing' },
  { id: 'R-02', name: 'Integration check B', tone: 'warning', status: 'Degraded' },
  { id: 'R-03', name: 'Integration check C', tone: 'danger', status: 'Failing' },
  { id: 'R-04', name: 'Integration check D', tone: 'success', status: 'Passing' },
];
