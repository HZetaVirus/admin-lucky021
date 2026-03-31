import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-logo">🂡</span>
          <h1>Lucky <span class="text-gold">021</span></h1>
          <p class="text-muted">Entre para sua conta</p>
        </div>
        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" type="email" [(ngModel)]="email" name="email" placeholder="seu&#64;email.com" required id="login-email">
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input class="form-input" type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required id="login-password">
          </div>
          @if (error()) {
            <div class="form-error">{{ error() }}</div>
          }
          <button type="submit" class="btn btn-primary btn-large" style="width:100%" [disabled]="loading()" id="login-submit">
            {{ loading() ? '🎲 Entrando...' : 'ENTRAR ♠' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Não tem conta? <a routerLink="/cadastro" class="text-gold">Cadastre-se</a></p>
        </div>
        <div class="auth-decoration" aria-hidden="true">
          <span class="suit-bg">♠</span>
          <span class="suit-bg red">♥</span>
          <span class="suit-bg red">♦</span>
          <span class="suit-bg">♣</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = ''; password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router, private toast: ToastService, private title: Title) {
    this.title.setTitle('Login — Lucky 021');
  }

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const user = await this.auth.login(this.email, this.password);
      this.toast.sucesso(`🂡 Bem-vindo de volta, ${user.name}!`);
      this.router.navigate([user.prefs?.role === 'admin' ? '/admin' : '/']);
    } catch (e: any) {
      this.error.set('Email ou senha incorretos. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
