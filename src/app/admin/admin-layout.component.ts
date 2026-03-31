import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <a routerLink="/admin" class="sidebar-logo">
            <span>♠</span>
            <span class="logo-text">Lucky 021</span>
          </a>
          <button class="sidebar-close show-mobile-only" (click)="sidebarOpen.set(false)">✕</button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobile()">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/produtos" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">👕</span> Produtos
          </a>
          <a routerLink="/admin/categorias" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">📁</span> Categorias
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">📦</span> Pedidos
          </a>
          <a routerLink="/admin/clientes" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">👥</span> Clientes
          </a>
          <a routerLink="/admin/estoque" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">📈</span> Estoque
          </a>
          <a routerLink="/admin/relatorios" routerLinkActive="active" (click)="closeMobile()">
            <span class="nav-icon">📋</span> Relatórios
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="sidebar-link">🏠 Voltar à Loja</a>
          <button class="sidebar-link" (click)="auth.logout()">🚪 Sair</button>
        </div>
      </aside>

      <!-- Content -->
      <div class="admin-content">
        <header class="admin-header">
          <button class="hamburger show-mobile-only" (click)="sidebarOpen.set(true)">
            <span></span><span></span><span></span>
          </button>
          <div class="admin-breadcrumb">
            <span class="text-gold">Admin</span>
          </div>
          <div class="admin-user">
            <span class="text-muted">{{ auth.userName() }}</span>
            <span class="user-avatar">♠</span>
          </div>
        </header>
        <div class="admin-page-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  sidebarOpen = signal(false);
  constructor(public auth: AuthService) {}
  closeMobile(): void { this.sidebarOpen.set(false); }
}
