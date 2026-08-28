import { Route } from '@angular/router';
import { ComplianceComponent } from './pages/compliance/compliance.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TokenLabComponent } from './pages/token-lab/token-lab.component';

export const appRoutes: Route[] = [
  { path: '', component: ComplianceComponent, title: 'Compliance case queue' },
  { path: 'devices', component: DashboardComponent, title: 'Devices' },
  { path: 'tokens', component: TokenLabComponent, title: 'Token Lab' },
  { path: '**', redirectTo: '' },
];
