import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  DsAlertComponent,
  DsButtonComponent,
  DsCardComponent,
  DsFormFieldComponent,
  DsIconComponent,
  DsInputComponent,
  DsSelectComponent,
  DsSpinnerComponent,
  DsTagComponent,
  DsTextComponent,
} from '@brand/ui';
import {
  BRAND_RAMP_TOKENS,
  COLOR_ROLE_TOKENS,
  ELEVATION_TOKENS,
  RADIUS_TOKENS,
  SELECT_OPTIONS,
  SPACE_TOKENS,
  TABLE_ROWS,
  TYPE_SPECIMENS,
} from './token-lab.fixtures';

/**
 * Token Lab — the integration surface for Figma → token / component work.
 *
 * The top half renders the generated `--ds-*` tokens as swatches; the bottom
 * half renders every `@brand/ui` component with stubbed data. Change a token
 * (or the brand / scheme in the header) and everything here moves together —
 * this is the page `node scripts/figma-tokens.mjs verify` points you at.
 */
@Component({
  selector: 'app-token-lab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzTableModule,
    DsTextComponent,
    DsButtonComponent,
    DsIconComponent,
    DsSpinnerComponent,
    DsTagComponent,
    DsInputComponent,
    DsSelectComponent,
    DsFormFieldComponent,
    DsCardComponent,
    DsAlertComponent,
  ],
  template: `
    <section class="lab">
      <header>
        <ds-text variant="caption">Design system</ds-text>
        <ds-text variant="title-lg" element="h1">Token Lab</ds-text>
        <ds-text variant="body" tone="secondary">
          Live view of the generated tokens and every component. Switch brand /
          scheme in the header — nothing re-renders, the CSS variables do the work.
        </ds-text>
      </header>

      <!-- ============ TOKENS ============ -->
      <ds-card heading="Colour — roles" padding="md">
        <div class="swatches">
          @for (t of colorRoles; track t) {
            <figure><span class="chip" [style.background]="cssVar(t)"></span><figcaption>--ds-{{ t }}</figcaption></figure>
          }
        </div>
      </ds-card>

      <ds-card heading="Colour — active brand ramp" padding="md">
        <div class="ramp">
          @for (t of brandRamp; track t) {
            <span class="ramp__step" [style.background]="cssVar(t)" [title]="'--ds-' + t"></span>
          }
        </div>
      </ds-card>

      <div class="two">
        <ds-card heading="Spacing" padding="md">
          @for (t of space; track t) {
            <div class="bar"><code>--ds-{{ t }}</code><span [style.width]="cssVar(t)"></span></div>
          }
        </ds-card>
        <ds-card heading="Radius & elevation" padding="md">
          <div class="tiles">
            @for (t of radius; track t) {
              <span class="tile" [style.borderRadius]="cssVar(t)"><code>{{ t }}</code></span>
            }
          </div>
          <div class="tiles">
            @for (t of elevation; track t) {
              <span class="tile" [style.boxShadow]="cssVar(t)"><code>{{ t }}</code></span>
            }
          </div>
        </ds-card>
      </div>

      <ds-card heading="Typography" padding="md">
        @for (s of typeSpecimens; track s.variant) {
          <ds-text [variant]="s.variant">{{ s.label }} — Sphinx of black quartz</ds-text>
        }
      </ds-card>

      <!-- ============ COMPONENTS ============ -->
      <ds-text variant="title" element="h2">Components</ds-text>

      <ds-card heading="Button" padding="md">
        <div class="row">
          <ds-button variant="primary">Primary</ds-button>
          <ds-button variant="secondary">Secondary</ds-button>
          <ds-button variant="ghost">Ghost</ds-button>
          <ds-button variant="link">Link</ds-button>
          <ds-button variant="danger">Danger</ds-button>
          <ds-button variant="primary" [loading]="true">Loading</ds-button>
          <ds-button variant="primary" [disabled]="true">Disabled</ds-button>
        </div>
      </ds-card>

      <div class="two">
        <ds-card heading="Icon / Spinner / Tag" padding="md">
          <div class="row">
            <ds-icon name="bell" size="lg" />
            <ds-icon name="setting" size="lg" />
            <ds-spinner size="md" />
          </div>
          <div class="row">
            <ds-tag tone="neutral">neutral</ds-tag>
            <ds-tag tone="brand">brand</ds-tag>
            <ds-tag tone="success">success</ds-tag>
            <ds-tag tone="warning">warning</ds-tag>
            <ds-tag tone="danger">danger</ds-tag>
            <ds-tag tone="info">info</ds-tag>
          </div>
        </ds-card>

        <ds-card heading="Form controls" padding="md">
          <ds-form-field label="Search" hint="Stubbed field">
            <ds-input placeholder="Type here…" [value]="query()" (valueChange)="query.set($event)" />
          </ds-form-field>
          <ds-form-field label="Risk" [error]="'Required'" [invalid]="!risk()">
            <ds-select
              [options]="selectOptions"
              [value]="risk()"
              (valueChange)="risk.set($event)"
            />
          </ds-form-field>
          <ds-input status="error" placeholder="Error state" />
        </ds-card>
      </div>

      <ds-card heading="Alert" padding="md">
        <ds-alert tone="info" title="Info">Background sync finished.</ds-alert>
        <ds-alert tone="success" title="Success">6 checks passing.</ds-alert>
        <ds-alert tone="warning" title="Warning">1 check degraded.</ds-alert>
        <ds-alert tone="danger" title="Error" [closable]="true">1 check failing.</ds-alert>
      </ds-card>

      <ds-card heading="Table (raw ng-zorro, token-skinned)" padding="none">
        <nz-table #t [nzData]="rows" [nzShowPagination]="false" nzSize="middle">
          <thead>
            <tr><th>ID</th><th>Check</th><th>Status</th><th>Result</th></tr>
          </thead>
          <tbody>
            @for (r of t.data; track r.id) {
              <tr>
                <td><ds-text variant="body-sm" element="span" tone="brand">{{ r.id }}</ds-text></td>
                <td>{{ r.name }}</td>
                <td>{{ r.status }}</td>
                <td><ds-tag [tone]="r.tone">{{ r.tone }}</ds-tag></td>
              </tr>
            }
          </tbody>
        </nz-table>
      </ds-card>
    </section>
  `,
  styles: [
    `
      .lab {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-7);
        max-width: 1100px;
        margin-inline: auto;
        padding: var(--ds-space-8) var(--ds-space-6) var(--ds-space-11);
      }
      .lab header { display: flex; flex-direction: column; gap: var(--ds-space-2); }
      .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--ds-space-5); }
      .row { display: flex; flex-wrap: wrap; gap: var(--ds-space-4); align-items: center; margin-bottom: var(--ds-space-4); }
      ds-card ds-form-field { display: block; margin-bottom: var(--ds-space-5); }
      ds-card ds-alert { display: flex; margin-bottom: var(--ds-space-3); }

      .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--ds-space-4); }
      .swatches figure { margin: 0; }
      .chip {
        display: block; height: 44px; border-radius: var(--ds-radius-md);
        border: 1px solid var(--ds-color-border-subtle);
      }
      .swatches figcaption {
        margin-top: var(--ds-space-2);
        font: var(--ds-font-weight-regular) var(--ds-font-size-xs) / 1.4 var(--ds-font-family-mono);
        color: var(--ds-color-text-tertiary);
      }
      .ramp { display: flex; height: 44px; border-radius: var(--ds-radius-md); overflow: clip; }
      .ramp__step { flex: 1; }
      .bar { display: flex; align-items: center; gap: var(--ds-space-4); margin-bottom: var(--ds-space-2); }
      .bar code { width: 96px; font: var(--ds-font-size-xs) / 1 var(--ds-font-family-mono); color: var(--ds-color-text-tertiary); }
      .bar span { height: 14px; background: var(--ds-color-action-primary); border-radius: 2px; }
      .tiles { display: flex; gap: var(--ds-space-4); flex-wrap: wrap; margin-bottom: var(--ds-space-4); }
      .tile {
        display: grid; place-items: center; width: 84px; height: 60px;
        background: var(--ds-color-bg-surface); border: 1px solid var(--ds-color-border-default);
      }
      .tile code { font: var(--ds-font-size-xs) / 1 var(--ds-font-family-mono); color: var(--ds-color-text-tertiary); }
      ds-card ds-text { display: block; margin-bottom: var(--ds-space-3); }
      nz-table { padding: var(--ds-space-2) var(--ds-space-4) var(--ds-space-5); }
      td ds-text[element='span'] { display: inline-block; margin: 0; }
    `,
  ],
})
export class TokenLabComponent {
  protected readonly colorRoles = COLOR_ROLE_TOKENS;
  protected readonly brandRamp = BRAND_RAMP_TOKENS;
  protected readonly space = SPACE_TOKENS;
  protected readonly radius = RADIUS_TOKENS;
  protected readonly elevation = ELEVATION_TOKENS;
  protected readonly typeSpecimens = TYPE_SPECIMENS;
  protected readonly selectOptions = SELECT_OPTIONS;
  protected readonly rows = TABLE_ROWS;

  protected readonly query = signal('firmware');
  protected readonly risk = signal<string | null>('medium');

  protected cssVar(name: string): string {
    return `var(--ds-${name})`;
  }
}
