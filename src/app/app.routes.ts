import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: '',
    loadComponent: () => import('./admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'produtos',
        loadComponent: () => import('./admin/produtos/produtos.component').then(m => m.AdminProdutosComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./admin/categorias/categorias.component').then(m => m.AdminCategoriasComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./admin/pedidos/pedidos.component').then(m => m.AdminPedidosComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./admin/clientes/clientes.component').then(m => m.AdminClientesComponent)
      },
      {
        path: 'estoque',
        loadComponent: () => import('./admin/estoque/estoque.component').then(m => m.AdminEstoqueComponent)
      },
      {
        path: 'relatorios',
        loadComponent: () => import('./admin/relatorios/relatorios.component').then(m => m.AdminRelatoriosComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
