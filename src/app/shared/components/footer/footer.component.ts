import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-top">
        <div class="container footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-card">🂡</span>
              <span class="logo-text">Lucky <span class="text-gold">021</span></span>
            </div>
            <p class="footer-desc">Aposte no estilo. Roupas premium para quem não tem medo de arriscar.</p>
            <div class="footer-suits" aria-hidden="true">
              <span>♠</span><span class="red">♥</span><span class="red">♦</span><span>♣</span>
            </div>
          </div>

          <!-- Links -->
          <div class="footer-links">
            <h4>Navegação</h4>
            <a routerLink="/">Início</a>
            <a routerLink="/catalogo">Catálogo</a>
            <a routerLink="/catalogo" [queryParams]="{filtro:'novidades'}">Novidades</a>
            <a routerLink="/catalogo" [queryParams]="{filtro:'promocoes'}">Promoções</a>
          </div>

          <!-- Help -->
          <div class="footer-links">
            <h4>Suporte</h4>
            <a href="#">Central de Ajuda</a>
            <a href="#">Trocas & Devoluções</a>
            <a href="#">Rastrear Pedido</a>
            <a href="#">Política de Privacidade</a>
          </div>

          <!-- Contact -->
          <div class="footer-links">
            <h4>Contato</h4>
            <p>contato&#64;lucky021.com.br</p>
            <p>(21) 99999-0021</p>
            <div class="footer-social">
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="TikTok">🎵</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p>© 2026 Lucky 021. Todos os direitos reservados.</p>
          <div class="footer-suits-small" aria-hidden="true">
            ♠ ♥ ♦ ♣
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-black);
      border-top: 1px solid rgba(212, 175, 55, 0.15);
      margin-top: auto;
    }

    .footer-top {
      padding: 4rem 0 3rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 3rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .footer-logo .logo-card {
      font-size: 1.8rem;
    }

    .footer-logo .logo-text {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--color-text-light);
    }

    .footer-desc {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .footer-suits {
      display: flex;
      gap: 1rem;
      font-size: 1.5rem;
      opacity: 0.3;
    }

    .footer-suits .red {
      color: var(--color-red-bright);
    }

    .footer-links h4 {
      font-family: var(--font-display);
      font-size: 1rem;
      color: var(--color-gold);
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer-links a,
    .footer-links p {
      display: block;
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      transition: color 0.2s ease;
    }

    .footer-links a:hover {
      color: var(--color-gold);
    }

    .footer-social {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      font-size: 1.3rem;
    }

    .footer-social a {
      transition: transform 0.2s ease;
    }

    .footer-social a:hover {
      transform: scale(1.2);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1.5rem 0;
    }

    .footer-bottom-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-bottom p {
      color: var(--color-text-muted);
      font-size: 0.8rem;
    }

    .footer-suits-small {
      color: var(--color-gold);
      opacity: 0.3;
      font-size: 0.9rem;
      letter-spacing: 4px;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-bottom-inner {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
