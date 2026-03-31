import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard page-enter">
      <h1>Dashboard</h1>

      <!-- Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">♛</div>
          <div class="metric-info">
            <span class="metric-value text-gold">R$ 45.890</span>
            <span class="metric-label">Vendas do Mês</span>
          </div>
          <span class="metric-trend up">+12%</span>
        </div>
        <div class="metric-card">
          <div class="metric-icon">♝</div>
          <div class="metric-info">
            <span class="metric-value">23</span>
            <span class="metric-label">Pedidos Pendentes</span>
          </div>
          <span class="metric-trend">♠</span>
        </div>
        <div class="metric-card warning">
          <div class="metric-icon">♞</div>
          <div class="metric-info">
            <span class="metric-value text-red">8</span>
            <span class="metric-label">Baixo Estoque</span>
          </div>
          <span class="metric-trend down">Alerta</span>
        </div>
        <div class="metric-card">
          <div class="metric-icon">♜</div>
          <div class="metric-info">
            <span class="metric-value">156</span>
            <span class="metric-label">Novos Clientes</span>
          </div>
          <span class="metric-trend up">+8%</span>
        </div>
      </div>

      <!-- Recent Orders & Top Products -->
      <div class="dashboard-grid">
        <div class="dash-section">
          <div class="section-title-row">
            <h3>Últimos Pedidos</h3>
            <a routerLink="/admin/pedidos" class="text-gold">Ver todos →</a>
          </div>
          <table class="data-table">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              @for (order of recentOrders; track order.id) {
              <tr>
                <td>#{{ order.id }}</td>
                <td>{{ order.cliente }}</td>
                <td class="text-gold">R$ {{ order.total.toFixed(2) }}</td>
                <td><span class="chip" [class]="'chip-' + order.chipColor">{{ order.status }}</span></td>
              </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="dash-section">
          <div class="section-title-row">
            <h3>Top Produtos</h3>
            <a routerLink="/admin/produtos" class="text-gold">Ver todos →</a>
          </div>
          <div class="top-products">
            @for (p of topProducts; track p.nome; let i = $index) {
            <div class="top-product">
              <span class="top-rank">{{ i + 1 }}°</span>
              <span class="top-suit" [class]="p.naipeCor">{{ p.naipe }}</span>
              <div class="top-info">
                <span class="top-name">{{ p.nome }}</span>
                <span class="top-sales text-muted">{{ p.vendas }} vendas</span>
              </div>
              <span class="top-revenue text-gold">R$ {{ p.receita.toFixed(2) }}</span>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent {
  recentOrders = [
    { id: '78901', cliente: 'João Silva', total: 459.90, status: 'Pendente', chipColor: 'gold' },
    { id: '78900', cliente: 'Maria Santos', total: 189.90, status: 'Confirmado', chipColor: 'green' },
    { id: '78899', cliente: 'Pedro Costa', total: 829.80, status: 'Enviado', chipColor: 'dark' },
    { id: '78898', cliente: 'Ana Lima', total: 279.90, status: 'Entregue', chipColor: 'green' },
    { id: '78897', cliente: 'Carlos Souza', total: 349.90, status: 'Pendente', chipColor: 'gold' },
  ];

  topProducts = [
    { nome: 'Camiseta Royal Flush', naipe: '♠', naipeCor: '', vendas: 234, receita: 44463.60 },
    { nome: 'Jaqueta All-In', naipe: '♥', naipeCor: 'red', vendas: 156, receita: 50227.20 },
    { nome: 'Calça Dealer', naipe: '♦', naipeCor: 'red', vendas: 189, receita: 52901.10 },
    { nome: 'Moletom Jackpot', naipe: '♣', naipeCor: '', vendas: 145, receita: 35519.50 },
    { nome: 'Tênis Ace', naipe: '♠', naipeCor: '', vendas: 98, receita: 58790.20 },
  ];
}
