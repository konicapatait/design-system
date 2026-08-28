import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DsBrandThemeSwitcherComponent, DsTextComponent } from '@brand/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DsBrandThemeSwitcherComponent,
    DsTextComponent,
  ],
  template: `
    <div class="shell">
      <header class="shell__bar">
        <div class="shell__brand">
          <span class="shell__mark" aria-hidden="true"></span>
          <ds-text variant="title-sm" element="span">Compliance Console</ds-text>
        </div>

        <nav class="shell__nav">
          <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }">
            Case queue
          </a>
          <a routerLink="/devices" routerLinkActive="is-active">Devices</a>
          <a routerLink="/tokens" routerLinkActive="is-active">Token Lab</a>
        </nav>

        <ds-brand-theme-switcher />
      </header>
      <main class="shell__main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100vh;
        background: var(--ds-color-bg-canvas);
      }
      .shell__bar {
        display: flex;
        align-items: center;
        gap: var(--ds-space-6);
        padding: var(--ds-space-4) var(--ds-space-6);
        background: var(--ds-color-bg-surface);
        border-bottom: var(--ds-border-width-hair) solid var(--ds-color-border-subtle);
        position: sticky;
        top: 0;
        z-index: var(--ds-z-index-sticky);
      }
      .shell__brand {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-3);
      }
      .shell__mark {
        inline-size: 22px;
        block-size: 22px;
        border-radius: var(--ds-radius-sm);
        background: linear-gradient(
          135deg,
          var(--ds-color-action-primary),
          var(--ds-color-brand-400)
        );
      }
      .shell__nav {
        display: flex;
        gap: var(--ds-space-2);
        margin-right: auto;
      }
      .shell__nav a {
        padding: var(--ds-space-2) var(--ds-space-4);
        border-radius: var(--ds-radius-sm);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-medium);
        color: var(--ds-color-text-secondary);
        text-decoration: none;
      }
      .shell__nav a:hover {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      .shell__nav a.is-active {
        background: var(--ds-color-action-primary-subtle);
        color: var(--ds-color-text-primary);
      }
    `,
  ],
})
export class AppComponent {}
