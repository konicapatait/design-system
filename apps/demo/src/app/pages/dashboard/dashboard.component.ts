import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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

interface Device {
  id: string;
  name: string;
  site: string;
  status: 'online' | 'degraded' | 'offline';
  firmware: string;
  lastSeen: string;
}

const STATUS_TONE: Record<Device['status'], DsTagTone> = {
  online: 'success',
  degraded: 'warning',
  offline: 'danger',
};

/**
 * One composed screen assembled entirely from `@brand/ui` (plus a raw
 * `nz-table` to show that un-wrapped ng-zorro is skinned by the same tokens).
 * Swap brand / scheme with the header switcher — nothing here re-renders,
 * the CSS custom properties do all the work.
 */
@Component({
  selector: 'app-dashboard',
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
          <ds-text variant="title-lg" element="h1">Devices</ds-text>
          <ds-text variant="body" tone="secondary">
            Fleet health across every connected site.
          </ds-text>
        </div>
        <ds-button variant="primary" iconStart="plus" (clicked)="added()">
          Add device
        </ds-button>
      </header>

      <div class="stats">
        @for (stat of stats(); track stat.label) {
          <ds-card padding="md">
            <ds-text variant="caption">{{ stat.label }}</ds-text>
            <ds-text variant="title" element="p">{{ stat.value }}</ds-text>
            <ds-tag [tone]="stat.tone">{{ stat.delta }}</ds-tag>
          </ds-card>
        }
      </div>

      <ds-alert tone="info" title="Firmware">
        {{ needsUpdate() }} devices are eligible for the 4.2.1 firmware rollout.
      </ds-alert>

      <ds-card heading="All devices" padding="none">
        <div class="filters">
          <ds-form-field label="Search" class="filters__search">
            <ds-input
              placeholder="Name or site…"
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
          <ds-button variant="secondary" (clicked)="reset()">Reset</ds-button>
        </div>

        <nz-table
          #table
          [nzData]="filtered()"
          [nzShowPagination]="true"
          [nzPageSize]="6"
          nzSize="middle"
        >
          <thead>
            <tr>
              <th nzWidth="26%">Device</th>
              <th>Site</th>
              <th>Status</th>
              <th>Firmware</th>
              <th>Last seen</th>
            </tr>
          </thead>
          <tbody>
            @for (device of table.data; track device.id) {
              <tr>
                <td>
                  <ds-text variant="body-sm" element="span">{{ device.name }}</ds-text>
                  <ds-text variant="caption" element="span">{{ device.id }}</ds-text>
                </td>
                <td>{{ device.site }}</td>
                <td>
                  <ds-tag [tone]="toneFor(device.status)">{{ device.status }}</ds-tag>
                </td>
                <td>{{ device.firmware }}</td>
                <td>{{ device.lastSeen }}</td>
              </tr>
            }
          </tbody>
        </nz-table>
      </ds-card>
    </section>
  `,
  styles: [
    `
      .page {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-7);
        max-width: 1080px;
        margin-inline: auto;
        padding: var(--ds-space-8) var(--ds-space-6) var(--ds-space-11);
      }
      .page__head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--ds-space-5);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
      td ds-text[element='span'] {
        display: block;
      }
      nz-table {
        padding: var(--ds-space-2) var(--ds-space-4) var(--ds-space-5);
      }
    `,
  ],
})
export class DashboardComponent {
  protected readonly query = signal('');
  protected readonly statusFilter = signal<string | null>(null);

  protected readonly statusOptions: DsSelectOption<string>[] = [
    { label: 'Online', value: 'online' },
    { label: 'Degraded', value: 'degraded' },
    { label: 'Offline', value: 'offline' },
  ];

  private readonly devices: Device[] = [
    { id: 'DV-1042', name: 'Lobby kiosk', site: 'HQ · Tokyo', status: 'online', firmware: '4.2.0', lastSeen: '2 min ago' },
    { id: 'DV-1043', name: 'Print hub 2F', site: 'HQ · Tokyo', status: 'degraded', firmware: '4.1.7', lastSeen: '11 min ago' },
    { id: 'DV-1057', name: 'Scanner bay', site: 'Osaka branch', status: 'online', firmware: '4.2.0', lastSeen: '4 min ago' },
    { id: 'DV-1061', name: 'Mailroom MFP', site: 'Osaka branch', status: 'offline', firmware: '4.0.9', lastSeen: '3 h ago' },
    { id: 'DV-1075', name: 'Design studio', site: 'Berlin office', status: 'online', firmware: '4.2.1', lastSeen: '1 min ago' },
    { id: 'DV-1080', name: 'Reception', site: 'Berlin office', status: 'degraded', firmware: '4.1.7', lastSeen: '27 min ago' },
    { id: 'DV-1091', name: 'Warehouse gate', site: 'Rotterdam DC', status: 'online', firmware: '4.2.0', lastSeen: '6 min ago' },
    { id: 'DV-1094', name: 'QA lab', site: 'Rotterdam DC', status: 'offline', firmware: '4.0.9', lastSeen: '1 d ago' },
  ];

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.devices.filter((d) => {
      const matchesText =
        !q || d.name.toLowerCase().includes(q) || d.site.toLowerCase().includes(q);
      const matchesStatus = !status || d.status === status;
      return matchesText && matchesStatus;
    });
  });

  protected readonly needsUpdate = computed(
    () => this.devices.filter((d) => d.firmware !== '4.2.1').length,
  );

  protected readonly stats = computed(() => {
    const online = this.devices.filter((d) => d.status === 'online').length;
    const degraded = this.devices.filter((d) => d.status === 'degraded').length;
    const offline = this.devices.filter((d) => d.status === 'offline').length;
    return [
      { label: 'Total devices', value: `${this.devices.length}`, delta: '+2 this week', tone: 'brand' as DsTagTone },
      { label: 'Online', value: `${online}`, delta: 'stable', tone: 'success' as DsTagTone },
      { label: 'Degraded', value: `${degraded}`, delta: '+1', tone: 'warning' as DsTagTone },
      { label: 'Offline', value: `${offline}`, delta: 'needs attention', tone: 'danger' as DsTagTone },
    ];
  });

  protected toneFor(status: Device['status']): DsTagTone {
    return STATUS_TONE[status];
  }

  protected added(): void {
    /* demo only */
  }

  protected reset(): void {
    this.query.set('');
    this.statusFilter.set(null);
  }
}
