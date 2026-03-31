import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Clientes</h1>
      <table class="data-table">
        <thead><tr><th>Avatar</th><th>Nome</th><th>Email</th><th>Pedidos</th><th>Total Gasto</th></tr></thead>
        <tbody>
          @for (c of clientes; track c.email) {
            <tr>
              <td><div class="client-avatar">{{ c.nome.charAt(0) }}</div></td>
              <td><strong>{{ c.nome }}</strong></td>
              <td class="text-muted">{{ c.email }}</td>
              <td>{{ c.pedidos }}</td>
              <td class="text-gold">R$ {{ c.totalGasto.toFixed(2) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 1.5rem; }
    .client-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-gold); color: var(--color-black); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
  `]
})
export class AdminClientesComponent {
  clientes = [
    { nome: 'João Silva', email: 'joao@email.com', pedidos: 5, totalGasto: 1890.50 },
    { nome: 'Maria Santos', email: 'maria@email.com', pedidos: 3, totalGasto: 879.70 },
    { nome: 'Pedro Costa', email: 'pedro@email.com', pedidos: 8, totalGasto: 3245.80 },
    { nome: 'Ana Lima', email: 'ana@email.com', pedidos: 2, totalGasto: 459.80 },
  ];
}
