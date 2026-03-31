import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="header-inner container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-card" aria-hidden="true">🂡</span>
          <span class="logo-text">Lucky <span class="logo-gold">021</span></span>
        </a>

        <!-- Desktop Nav -->
        <nav class="nav-desktop hide-mobile">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Início</a>
          <span class="nav-suit" aria-hidden="true">♠</span>
          <a routerLink="/catalogo" routerLinkActive="active">Catálogo</a>
          <span class="nav-suit red" aria-hidden="true">♥</span>
          <a routerLink="/catalogo" [queryParams]="{filtro:'novidades'}" routerLinkActive="active">Novidades</a>
          <span class="nav-suit" aria-hidden="true">♣</span>
          <a routerLink="/catalogo" [queryParams]="{filtro:'promocoes'}" routerLinkActive="active">Promoções</a>
        </nav>

        <!-- Actions -->
        <div class="header-actions">
          <!-- Cart -->
          <a routerLink="/carrinho" class="cart-btn" id="header-cart-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            @if (carrinho.cartCount() > 0) {
              <span class="cart-badge">{{ carrinho.cartCount() }}</span>
            }
          </a>

          <!-- User -->
          @if (auth.isLoggedIn()) {
            <a [routerLink]="auth.isAdmin() ? '/admin' : '/minha-conta'" class="user-btn" id="header-user-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>
          } @else {
            <a routerLink="/login" class="btn btn-secondary btn-small" id="header-login-btn">Entrar</a>
          }

          <!-- Mobile Hamburger -->
          <button class="hamburger show-mobile-only" (click)="toggleMobile()" id="header-menu-btn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div class="mobile-menu" (click)="closeMobile()">
          <nav class="mobile-nav" (click)="$event.stopPropagation()">
            <a routerLink="/" (click)="closeMobile()">♠ Início</a>
            <a routerLink="/catalogo" (click)="closeMobile()">♥ Catálogo</a>
            <a routerLink="/catalogo" [queryParams]="{filtro:'novidades'}" (click)="closeMobile()">♦ Novidades</a>
            <a routerLink="/catalogo" [queryParams]="{filtro:'promocoes'}" (click)="closeMobile()">♣ Promoções</a>
            <div class="mobile-nav-divider"></div>
            @if (auth.isLoggedIn()) {
              <a [routerLink]="auth.isAdmin() ? '/admin' : '/minha-conta'" (click)="closeMobile()">🂡 Minha Conta</a>
            } @else {
              <a routerLink="/login" (click)="closeMobile()">Entrar</a>
              <a routerLink="/cadastro" (click)="closeMobile()">Cadastrar</a>
            }
          </nav>
        </div>
      }
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: rgba(13, 13, 13, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      transition: all 0.3s ease;
    }

    .header.scrolled {
      background: rgba(13, 13, 13, 0.98);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }

    @media (min-width: 768px) { .header-inner { height: 72px; } }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-text-light);
    }

    @media (min-width: 768px) { .logo { gap: 0.6rem; } }

    .logo-card {
      font-size: 1.6rem;
      transition: transform 0.6s ease;
      display: inline-block;
    }

    @media (min-width: 768px) { .logo-card { font-size: 2rem; } }

    .logo:hover .logo-card { transform: rotateY(180deg); }

    .logo-text {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    @media (min-width: 768px) { .logo-text { font-size: 1.5rem; } }

    .logo-gold { color: var(--color-gold); }

    /* Desktop Nav */
    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-desktop a {
      color: var(--color-text-light);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-desktop a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--color-gold);
      transition: width 0.3s ease;
    }

    .nav-desktop a:hover,
    .nav-desktop a.active { color: var(--color-gold); }

    .nav-desktop a:hover::after,
    .nav-desktop a.active::after { width: 100%; }

    .nav-suit { color: var(--color-gold); opacity: 0.4; font-size: 0.75rem; }
    .nav-suit.red { color: var(--color-red-bright); }

    /* Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (min-width: 768px) { .header-actions { gap: 1rem; } }

    .cart-btn, .user-btn {
      position: relative;
      color: var(--color-text-light);
      transition: color 0.3s ease;
      padding: 0.6rem;
      -webkit-tap-highlight-color: transparent;
    }

    .cart-btn:hover, .user-btn:hover { color: var(--color-gold); }

    .cart-badge {
      position: absolute;
      top: 2px;
      right: 0;
      width: 18px;
      height: 18px;
      background: var(--color-red);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Hamburger */
    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 0.6rem;
      background: none;
      border: none;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--color-text-light);
      transition: all 0.3s ease;
    }

    /* Mobile Menu */
    .mobile-menu {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 300;
      animation: fadeInUp 0.2s ease;
    }

    .mobile-nav {
      position: absolute;
      top: 0;
      right: 0;
      width: min(280px, 80vw);
      height: 100%;
      background: var(--color-black);
      border-left: 1px solid rgba(212, 175, 55, 0.2);
      padding: 4.5rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .mobile-nav a {
      display: block;
      padding: 1rem;
      color: var(--color-text-light);
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 1px;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .mobile-nav a:hover {
      background: rgba(212, 175, 55, 0.1);
      color: var(--color-gold);
    }

    .mobile-nav-divider {
      height: 1px;
      background: rgba(212, 175, 55, 0.2);
      margin: 0.5rem 0;
    }
  `]
})
export class HeaderComponent {
  mobileOpen = signal(false);
  isScrolled = signal(false);

  constructor(
    public carrinho: CarrinhoService,
    public auth: AuthService
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }
  }

  toggleMobile(): void {
    this.mobileOpen.set(!this.mobileOpen());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
