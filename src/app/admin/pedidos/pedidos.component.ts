import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Pedidos</h1>
      <!-- Status Chips Filter -->
      <div class="status-filters">
        @for (s of statusList; track s.value) {
          <button class="chip" [class]="'chip-' + s.chipColor" [class.active]="selectedStatus === s.value" (click)="selectedStatus = s.value">
            {{ s.label }} ({{ s.count }})
          </button>
        }
      </div>

      <table class="data-table">
        <thead><tr><th>ID</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          @for (order of pedidos; track order.id) {
            <tr>
              <td>#{{ order.id }}</td>
              <td>{{ order.cliente }}</td>
              <td class="text-muted">{{ order.data }}</td>
              <td class="text-gold">R$ {{ order.total.toFixed(2) }}</td>
              <td><span class="chip" [class]="'chip-' + order.chipColor">{{ order.status }}</span></td>
              <td><button class="btn btn-secondary btn-small">Detalhes</button></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .status-filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .status-filters .chip { cursor: pointer; transition: all 0.2s; }
    .status-filters .chip:hover { transform: translateY(-2px); }
    h1 { margin-bottom: 1.5rem; }
  `]
})
export class AdminPedidosComponent {
  selectedStatus = '';
  statusList = [
    { value: '', label: 'Todos', chipColor: 'dark', count: 47 },
    { value: 'pendente', label: 'Pendentes', chipColor: 'gold', count: 12 },
    { value: 'confirmado', label: 'Confirmados', chipColor: 'green', count: 8 },
    { value: 'enviado', label: 'Enviados', chipColor: 'dark', count: 15 },
    { value: 'entregue', label: 'Entregues', chipColor: 'green', count: 10 },
    { value: 'cancelado', label: 'Cancelados', chipColor: 'red', count: 2 },
  ];
  pedidos = [
    { id: '78901', cliente: 'João Silva', data: '30/03/2026', total: 459.90, status: 'Pendente', chipColor: 'gold' },
    { id: '78900', cliente: 'Maria Santos', data: '30/03/2026', total: 189.90, status: 'Confirmado', chipColor: 'green' },
    { id: '78899', cliente: 'Pedro Costa', data: '29/03/2026', total: 829.80, status: 'Enviado', chipColor: 'dark' },
    { id: '78898', cliente: 'Ana Lima', data: '28/03/2026', total: 279.90, status: 'Entregue', chipColor: 'green' },
    { id: '78897', cliente: 'Carlos Souza', data: '28/03/2026', total: 349.90, status: 'Pendente', chipColor: 'gold' },
  ];
}
