import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Controle de Estoque</h1>
      <table class="data-table">
        <thead><tr><th>Produto</th><th>Tamanho</th><th>Cor</th><th>Estoque</th><th>Status</th></tr></thead>
        <tbody>
          @for (item of estoque; track item.id) {
            <tr [class.low-stock]="item.qtd <= 5">
              <td><strong>{{ item.produto }}</strong></td>
              <td>{{ item.tamanho }}</td>
              <td>{{ item.cor }}</td>
              <td>
                <input type="number" class="form-input inline-input" [(ngModel)]="item.qtd" [class.error]="item.qtd <= 5">
              </td>
              <td>
                @if (item.qtd === 0) {
                  <span class="chip chip-red">Esgotado</span>
                } @else if (item.qtd <= 5) {
                  <span class="chip chip-gold">Baixo</span>
                } @else {
                  <span class="chip chip-green">Normal</span>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 1.5rem; }
    .inline-input { width: 80px; padding: 0.4rem 0.6rem; text-align: center; }
    .low-stock { background: rgba(231, 76, 60, 0.05); }
  `]
})
export class AdminEstoqueComponent {
  estoque = [
    { id: 1, produto: 'Camiseta Royal Flush', tamanho: 'P', cor: 'Preto', qtd: 15 },
    { id: 2, produto: 'Camiseta Royal Flush', tamanho: 'M', cor: 'Preto', qtd: 23 },
    { id: 3, produto: 'Camiseta Royal Flush', tamanho: 'G', cor: 'Preto', qtd: 3 },
    { id: 4, produto: 'Jaqueta All-In', tamanho: 'M', cor: 'Preto', qtd: 8 },
    { id: 5, produto: 'Jaqueta All-In', tamanho: 'G', cor: 'Preto', qtd: 0 },
    { id: 6, produto: 'Calça Dealer', tamanho: 'M', cor: 'Preto', qtd: 45 },
    { id: 7, produto: 'Boné Lucky Strike', tamanho: 'Único', cor: 'Preto', qtd: 2 },
  ];
}
