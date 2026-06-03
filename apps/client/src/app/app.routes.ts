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
    },
    {
        path: 'routing-detail/:id',
        loadComponent: () => import('../pages/routing-detail/routing-detail').then(m => m.RoutingDetail)
    },
    {
        path: 'create-routing',
        loadComponent: () => import('../pages/create-routing/create-routing').then(m => m.CreateRouting)
    }
];
