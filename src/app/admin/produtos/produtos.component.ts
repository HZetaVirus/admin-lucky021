import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page page-enter">
      <div class="page-title-row">
        <h1>Produtos</h1>
        <button class="btn btn-primary" (click)="showForm.set(!showForm())">♠ NOVO PRODUTO</button>
      </div>

      <!-- Filters -->
      <div class="filters-row">
        <input class="form-input" placeholder="🔍 Buscar produto..." [(ngModel)]="search" style="max-width:300px;">
        <select class="form-select" style="max-width:200px;">
          <option value="">Todas categorias</option>
          <option>Camisetas</option><option>Calças</option><option>Jaquetas</option><option>Acessórios</option>
        </select>
      </div>

      <!-- Table -->
      <table class="data-table">
        <thead>
          <tr><th>Imagem</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ativo</th><th>Ações</th></tr>
        </thead>
        <tbody>
          @for (produto of produtos; track produto.id) {
            <tr>
              <td><div class="thumb"><span class="thumb-suit">{{ produto.naipe }}</span></div></td>
              <td><strong>{{ produto.nome }}</strong></td>
              <td>{{ produto.categoria }}</td>
              <td class="text-gold">R$ {{ produto.preco.toFixed(2) }}</td>
              <td [class.text-red]="produto.estoque <= 5">{{ produto.estoque }}</td>
              <td>
                <div class="toggle" [class.active]="produto.ativo" (click)="produto.ativo = !produto.ativo"></div>
              </td>
              <td>
                <button class="btn btn-secondary btn-small">Editar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button class="pagination-btn">←</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">3</button>
        <button class="pagination-btn">→</button>
      </div>
    </div>
  `,
  styleUrl: './produtos.component.css'
})
export class AdminProdutosComponent {
  search = '';
  showForm = signal(false);
  produtos = [
    { id: '1', nome: 'Camiseta Royal Flush', categoria: 'Camisetas', preco: 189.90, estoque: 45, ativo: true, naipe: '♠' },
    { id: '2', nome: 'Jaqueta All-In', categoria: 'Jaquetas', preco: 459.90, estoque: 12, ativo: true, naipe: '♥' },
    { id: '3', nome: 'Calça Dealer', categoria: 'Calças', preco: 279.90, estoque: 3, ativo: true, naipe: '♦' },
    { id: '4', nome: 'Boné Lucky Strike', categoria: 'Acessórios', preco: 129.90, estoque: 67, ativo: true, naipe: '♣' },
    { id: '5', nome: 'Moletom Jackpot', categoria: 'Camisetas', preco: 349.90, estoque: 0, ativo: false, naipe: '♠' },
    { id: '6', nome: 'Bermuda High Roller', categoria: 'Calças', preco: 199.90, estoque: 23, ativo: true, naipe: '♥' },
  ];
}
