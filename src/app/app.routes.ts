import { Routes } from '@angular/router';
import { HomeComponent } from './cloudy-body/home/home.component';
import { AnalyticsComponent } from './cloudy-body/analytics/analytics.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'analytics', component: AnalyticsComponent }
];
