import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DsBrandThemeSwitcherComponent, DsTextComponent } from '@brand/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, DsBrandThemeSwitcherComponent, DsTextComponent],
  template: `
    <div class="shell">
      <header class="shell__bar">
        <div class="shell__brand">
          <span class="shell__mark" aria-hidden="true"></span>
          <ds-text variant="title-sm" element="span">Brand Console</ds-text>
        </div>
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
        justify-content: space-between;
        gap: var(--ds-space-5);
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
    `,
  ],
})
export class AppComponent {}
