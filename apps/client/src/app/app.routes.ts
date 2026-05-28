import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('../pages/home/home').then(m => m.Home)
    },
    {
        path: 'routing-list',
        loadComponent: () => import('../pages/routing-list/routing-list').then(m => m.RoutingList)
    }
];
