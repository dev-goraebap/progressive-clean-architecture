import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('src/pages').then(m => m.FeedPage)
    },
    {
        path: 'profile',
        loadComponent: () => import('src/pages').then(m => m.ProfilePage)
    },
    {
        path: 'settings',
        loadComponent: () => import('src/pages').then(m => m.SettingPage)
    },
];
