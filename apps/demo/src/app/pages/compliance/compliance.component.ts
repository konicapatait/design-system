import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  DsAlertComponent,
  DsButtonComponent,
  DsCardComponent,
  DsFormFieldComponent,
  DsInputComponent,
  DsSelectComponent,
  DsSelectOption,
  DsTagComponent,
  DsTagTone,
  DsTextComponent,
} from '@brand/ui';

type Risk = 'low' | 'medium' | 'high' | 'critical';
type Status =
  | 'new'
  | 'in-review'
  | 'escalated'
  | 'pending-info'
  | 'cleared'
  | 'sar-filed';

interface CaseRow {
  id: string;
  customer: string;
  channel: 'Wire' | 'Money transfer' | 'Digital wallet' | 'Agent location';
  corridor: string;
  amount: number;
  currency: string;
  risk: Risk;
  status: Status;
  analyst: string;
  opened: string;
  /** Hours left on the 24h review SLA; negative = breached. */
  slaHoursLeft: number;
  factors: string[];
}

const RISK_TONE: Record<Risk, DsTagTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'danger',
};

const STATUS_META: Record<Status, { label: string; tone: DsTagTone }> = {
  new: { label: 'New', tone: 'info' },
  'in-review': { label: 'In review', tone: 'neutral' },
  escalated: { label: 'Escalated', tone: 'warning' },
  'pending-info': { label: 'Pending info', tone: 'info' },
  cleared: { label: 'Cleared', tone: 'success' },
  'sar-filed': { label: 'SAR filed', tone: 'danger' },
};

const CASES: CaseRow[] = [
  {
    id: 'CMP-2048', customer: 'Jordan Avery', channel: 'Wire', corridor: 'US → PH',
    amount: 9450, currency: 'USD', risk: 'critical', status: 'escalated',
    analyst: 'M. Osei', opened: '2h ago', slaHoursLeft: -3,
    factors: ['Structuring pattern (3× just under $10k)', 'New beneficiary', 'High-risk corridor', 'PEP name match — 82%'],
  },
  {
    id: 'CMP-2047', customer: 'Priya Nair', channel: 'Money transfer', corridor: 'GB → NG',
    amount: 3200, currency: 'GBP', risk: 'high', status: 'in-review',
    analyst: 'M. Osei', opened: '4h ago', slaHoursLeft: 4,
    factors: ['Velocity: 6 transfers / 24h', 'Sender-receiver name mismatch'],
  },
  {
    id: 'CMP-2046', customer: 'Diego Ramos', channel: 'Digital wallet', corridor: 'US → MX',
    amount: 1800, currency: 'USD', risk: 'medium', status: 'pending-info',
    analyst: 'L. Chen', opened: '6h ago', slaHoursLeft: 9,
    factors: ['Device shared with 2 other accounts'],
  },
  {
    id: 'CMP-2045', customer: 'Amina Suleiman', channel: 'Agent location', corridor: 'AE → SO',
    amount: 4990, currency: 'USD', risk: 'high', status: 'new',
    analyst: 'Unassigned', opened: '7h ago', slaHoursLeft: 2,
    factors: ['Sanctioned-region proximity', 'Cash pickup', 'Round-number amount'],
  },
  {
    id: 'CMP-2044', customer: 'Tomasz Nowak', channel: 'Wire', corridor: 'PL → DE',
    amount: 15000, currency: 'EUR', risk: 'medium', status: 'in-review',
    analyst: 'L. Chen', opened: '9h ago', slaHoursLeft: 12,
    factors: ['Amount above customer baseline (4×)'],
  },
  {
    id: 'CMP-2043', customer: 'Grace Mbeki', channel: 'Money transfer', corridor: 'US → KE',
    amount: 620, currency: 'USD', risk: 'low', status: 'cleared',
    analyst: 'A. Park', opened: '11h ago', slaHoursLeft: 18,
    factors: ['Matches remittance history'],
  },
  {
    id: 'CMP-2041', customer: 'Victor Alvarez', channel: 'Digital wallet', corridor: 'US → CO',
    amount: 8750, currency: 'USD', risk: 'critical', status: 'sar-filed',
    analyst: 'M. Osei', opened: '1d ago', slaHoursLeft: -20,
    factors: ['Confirmed mule account', 'Law-enforcement referral'],
  },
  {
    id: 'CMP-2040', customer: 'Sofia Rossi', channel: 'Wire', corridor: 'IT → AL',
    amount: 2100, currency: 'EUR', risk: 'medium', status: 'in-review',
    analyst: 'A. Park', opened: '1d ago', slaHoursLeft: 5,
    factors: ['Third-party sender'],
  },
  {
    id: 'CMP-2039', customer: 'Chen Wei', channel: 'Money transfer', corridor: 'US → CN',
    amount: 990, currency: 'USD', risk: 'low', status: 'cleared',
    analyst: 'A. Park', opened: '2d ago', slaHoursLeft: 22,
    factors: ['Low-value, established recipient'],
  },
];

/**
 * Compliance Case Management.
 *
 * A transaction-monitoring case queue built entirely from `@brand/ui`
 * (plus a raw `nz-table`). Every colour comes from the tokens, so the page
 * carries whichever brand is active purely through `data-brand` on `<html>`
 * (the demo ships with `brand-3`).
 */
@Component({
  selector: 'app-compliance',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzTableModule,
    DsTextComponent,
    DsButtonComponent,
    DsCardComponent,
    DsTagComponent,
    DsAlertComponent,
    DsFormFieldComponent,
    DsInputComponent,
    DsSelectComponent,
  ],
  template: `
    <section class="page">
      <header class="page__head">
        <div>
          <ds-text variant="caption">Transaction monitoring</ds-text>
          <ds-text variant="title-lg" element="h1">Compliance case queue</ds-text>
          <ds-text variant="body" tone="secondary">
            Alerts routed from the monitoring engine, pending analyst disposition.
          </ds-text>
        </div>
        <div class="page__actions">
          <ds-button variant="secondary" iconStart="download">Export</ds-button>
          <ds-button variant="primary" iconStart="plus">New case</ds-button>
        </div>
      </header>

      <div class="stats">
        @for (s of stats(); track s.label) {
          <ds-card padding="md">
            <ds-text variant="caption">{{ s.label }}</ds-text>
            <ds-text variant="title" element="p">{{ s.value }}</ds-text>
            <ds-tag [tone]="s.tone">{{ s.note }}</ds-tag>
          </ds-card>
        }
      </div>

      @if (breached() > 0) {
        <ds-alert tone="danger" title="SLA breach">
          {{ breached() }} case{{ breached() === 1 ? '' : 's' }} have passed the
          24-hour review SLA and need disposition now.
        </ds-alert>
      }

      <ds-card heading="Queue" padding="none">
        <div class="filters">
          <ds-form-field label="Search" class="filters__search">
            <ds-input
              placeholder="Case ID, customer or corridor…"
              [value]="query()"
              (valueChange)="query.set($event)"
            />
          </ds-form-field>
          <ds-form-field label="Status">
            <ds-select
              [options]="statusOptions"
              [value]="statusFilter()"
              (valueChange)="statusFilter.set($event)"
            />
          </ds-form-field>
          <ds-form-field label="Risk">
            <ds-select
              [options]="riskOptions"
              [value]="riskFilter()"
              (valueChange)="riskFilter.set($event)"
            />
          </ds-form-field>
          <ds-button variant="secondary" (clicked)="reset()">Reset</ds-button>
        </div>

        <nz-table
          #table
          [nzData]="filtered()"
          [nzPageSize]="7"
          [nzShowPagination]="filtered().length > 7"
          nzSize="middle"
        >
          <thead>
            <tr>
              <th nzWidth="130px">Case</th>
              <th>Customer</th>
              <th>Channel</th>
              <th class="num">Amount</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Analyst</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            @for (row of table.data; track row.id) {
              <tr
                class="queue-row"
                [class.queue-row--active]="row.id === selectedId()"
                (click)="selectedId.set(row.id)"
              >
                <td>
                  <ds-text variant="body-sm" element="span" tone="brand">{{ row.id }}</ds-text>
                  <ds-text variant="caption" element="span">{{ row.opened }}</ds-text>
                </td>
                <td>
                  <ds-text variant="body-sm" element="span">{{ row.customer }}</ds-text>
                  <ds-text variant="caption" element="span">{{ row.corridor }}</ds-text>
                </td>
                <td>{{ row.channel }}</td>
                <td class="num">{{ money(row.amount, row.currency) }}</td>
                <td><ds-tag [tone]="riskTone(row.risk)">{{ row.risk }}</ds-tag></td>
                <td><ds-tag [tone]="statusTone(row.status)">{{ statusLabel(row.status) }}</ds-tag></td>
                <td>{{ row.analyst }}</td>
                <td><ds-tag [tone]="slaTone(row.slaHoursLeft)">{{ slaLabel(row.slaHoursLeft) }}</ds-tag></td>
              </tr>
            }
          </tbody>
        </nz-table>
      </ds-card>

      @if (selected(); as c) {
        <ds-card [heading]="c.id + ' · ' + c.customer" padding="lg">
          <div dsCardActions>
            <ds-tag [tone]="riskTone(c.risk)">{{ c.risk }} risk</ds-tag>
          </div>

          <div class="detail">
            <dl class="facts">
              <div><dt>Channel</dt><dd>{{ c.channel }}</dd></div>
              <div><dt>Corridor</dt><dd>{{ c.corridor }}</dd></div>
              <div><dt>Amount</dt><dd>{{ money(c.amount, c.currency) }}</dd></div>
              <div><dt>Analyst</dt><dd>{{ c.analyst }}</dd></div>
              <div><dt>Opened</dt><dd>{{ c.opened }}</dd></div>
              <div><dt>Status</dt><dd>{{ statusLabel(c.status) }}</dd></div>
            </dl>

            <div class="risk-factors">
              <ds-text variant="body-sm" tone="secondary">Risk factors</ds-text>
              <ul>
                @for (f of c.factors; track f) {
                  <li>
                    <ds-tag [tone]="c.risk === 'critical' ? 'danger' : 'warning'">•</ds-tag>
                    <span>{{ f }}</span>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div dsCardFooter class="detail__actions">
            <ds-button variant="secondary">Request info</ds-button>
            <ds-button variant="secondary">Escalate</ds-button>
            <ds-button variant="danger">File SAR</ds-button>
            <ds-button variant="primary">Clear case</ds-button>
          </div>
        </ds-card>
      }
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-7);
        max-width: 1120px;
        margin-inline: auto;
        padding: var(--ds-space-8) var(--ds-space-6) var(--ds-space-11);
      }
      .page__head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--ds-space-5);
      }
      .page__actions {
        display: flex;
        gap: var(--ds-space-3);
        flex-shrink: 0;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: var(--ds-space-5);
      }
      .stats ds-card {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-2);
        align-items: flex-start;
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: var(--ds-space-5);
        padding: var(--ds-space-5) var(--ds-space-6);
        border-bottom: var(--ds-border-width-hair) solid var(--ds-color-border-subtle);
      }
      .filters__search {
        flex: 1 1 260px;
      }
      nz-table {
        padding: var(--ds-space-2) var(--ds-space-4) var(--ds-space-5);
      }
      .num {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      td ds-text[element='span'] {
        display: block;
      }
      .queue-row {
        cursor: pointer;
      }
      .queue-row:hover td {
        background: var(--ds-color-bg-hover);
      }
      .queue-row--active td {
        background: var(--ds-color-action-primary-subtle);
        box-shadow: inset 3px 0 0 var(--ds-color-action-primary);
      }

      .detail {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--ds-space-8);
      }
      .facts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--ds-space-4) var(--ds-space-6);
        margin: 0;
      }
      .facts dt {
        font-size: var(--ds-font-size-xs);
        text-transform: uppercase;
        letter-spacing: var(--ds-font-letter-spacing-wide);
        color: var(--ds-color-text-tertiary);
        margin-bottom: 2px;
      }
      .facts dd {
        margin: 0;
        font-size: var(--ds-font-size-sm);
        color: var(--ds-color-text-primary);
      }
      .risk-factors ul {
        list-style: none;
        margin: var(--ds-space-3) 0 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-3);
      }
      .risk-factors li {
        display: flex;
        gap: var(--ds-space-3);
        align-items: baseline;
        font-size: var(--ds-font-size-sm);
        color: var(--ds-color-text-secondary);
      }
      .detail__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ds-space-3);
        justify-content: flex-end;
      }

      @media (max-width: 860px) {
        .page__head { flex-direction: column; }
        .detail { grid-template-columns: 1fr; gap: var(--ds-space-6); }
      }
    `,
  ],
})
export class ComplianceComponent {
  protected readonly query = signal('');
  protected readonly statusFilter = signal<string | null>(null);
  protected readonly riskFilter = signal<string | null>(null);
  protected readonly selectedId = signal<string>(CASES[0].id);

  protected readonly statusOptions: DsSelectOption<string>[] = (
    Object.keys(STATUS_META) as Status[]
  ).map((s) => ({ label: STATUS_META[s].label, value: s }));

  protected readonly riskOptions: DsSelectOption<string>[] = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  private readonly cases = CASES;

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    const risk = this.riskFilter();
    return this.cases.filter((c) => {
      const text =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.customer.toLowerCase().includes(q) ||
        c.corridor.toLowerCase().includes(q);
      return text && (!status || c.status === status) && (!risk || c.risk === risk);
    });
  });

  protected readonly selected = computed(
    () => this.cases.find((c) => c.id === this.selectedId()) ?? null,
  );

  protected readonly breached = computed(
    () => this.cases.filter((c) => c.slaHoursLeft < 0 && !this.isClosed(c)).length,
  );

  protected readonly stats = computed(() => {
    const open = this.cases.filter((c) => !this.isClosed(c)).length;
    const review = this.cases.filter((c) => c.status === 'in-review').length;
    const escalated = this.cases.filter((c) => c.status === 'escalated').length;
    const cleared = this.cases.filter((c) => c.status === 'cleared').length;
    return [
      { label: 'Open cases', value: `${open}`, note: 'live queue', tone: 'brand' as DsTagTone },
      { label: 'In review', value: `${review}`, note: 'assigned', tone: 'info' as DsTagTone },
      { label: 'Escalated', value: `${escalated}`, note: 'L2 review', tone: 'warning' as DsTagTone },
      { label: 'SLA breached', value: `${this.breached()}`, note: 'act now', tone: 'danger' as DsTagTone },
      { label: 'Cleared today', value: `${cleared}`, note: '+4 vs. avg', tone: 'success' as DsTagTone },
    ];
  });

  protected riskTone(r: Risk): DsTagTone {
    return RISK_TONE[r];
  }
  protected statusTone(s: Status): DsTagTone {
    return STATUS_META[s].tone;
  }
  protected statusLabel(s: Status): string {
    return STATUS_META[s].label;
  }

  protected slaTone(hours: number): DsTagTone {
    if (hours < 0) return 'danger';
    if (hours <= 6) return 'warning';
    return 'neutral';
  }
  protected slaLabel(hours: number): string {
    if (hours < 0) return `Breached ${Math.abs(hours)}h`;
    return `${hours}h left`;
  }

  protected money(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected reset(): void {
    this.query.set('');
    this.statusFilter.set(null);
    this.riskFilter.set(null);
  }

  private isClosed(c: CaseRow): boolean {
    return c.status === 'cleared' || c.status === 'sar-filed';
  }
}
