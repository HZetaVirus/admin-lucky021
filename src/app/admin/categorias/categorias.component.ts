import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <div class="page-title-row">
        <h1>Categorias</h1>
        <button class="btn btn-primary">♠ NOVA CATEGORIA</button>
      </div>
      <table class="data-table">
        <thead><tr><th>Naipe</th><th>Nome</th><th>Slug</th><th>Ativa</th><th>Ações</th></tr></thead>
        <tbody>
          @for (cat of categorias; track cat.slug) {
            <tr>
              <td><span class="cat-suit" [class]="cat.suitColor">{{ cat.suit }}</span></td>
              <td><strong>{{ cat.nome }}</strong></td>
              <td class="text-muted">{{ cat.slug }}</td>
              <td><div class="toggle" [class.active]="cat.ativa" (click)="cat.ativa = !cat.ativa"></div></td>
              <td><button class="btn btn-secondary btn-small">Editar</button></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .cat-suit { font-size: 1.5rem; color: var(--color-gold); }
    .cat-suit.red { color: var(--color-red-bright); }
  `]
})
export class AdminCategoriasComponent {
  categorias = [
    { nome: 'Camisetas', slug: 'camisetas', suit: '♠', suitColor: '', ativa: true },
    { nome: 'Calças', slug: 'calcas', suit: '♥', suitColor: 'red', ativa: true },
    { nome: 'Jaquetas', slug: 'jaquetas', suit: '♦', suitColor: 'red', ativa: true },
    { nome: 'Acessórios', slug: 'acessorios', suit: '♣', suitColor: '', ativa: true },
  ];
}
