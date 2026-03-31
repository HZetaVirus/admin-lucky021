import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { PedidoService, Pedido } from '../../core/services/pedido.service';
import { ProdutoService, Produto } from '../../core/services/produto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { RealtimeService } from '../../core/services/realtime.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard page-enter">
      <h1>Dashboard</h1>

      @if (loading()) {
        <div class="loading-state">
          <span class="text-gold">Carregando métricas...</span>
        </div>
      } @else {
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">♛</div>
            <div class="metric-info">
              <span class="metric-value text-gold">R$ {{ totalVendas().toFixed(2) }}</span>
              <span class="metric-label">Total Vendas</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">♝</div>
            <div class="metric-info">
              <span class="metric-value">{{ pedidosPendentes() }}</span>
              <span class="metric-label">Pedidos Pendentes</span>
            </div>
          </div>
          <div class="metric-card warning">
            <div class="metric-icon">♞</div>
            <div class="metric-info">
              <span class="metric-value text-red">{{ baixoEstoque() }}</span>
              <span class="metric-label">Baixo Estoque</span>
            </div>
            <span class="metric-trend down">Alerta</span>
          </div>
          <div class="metric-card">
            <div class="metric-icon">♜</div>
            <div class="metric-info">
              <span class="metric-value">{{ totalProdutos() }}</span>
              <span class="metric-label">Total Produtos</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dash-section">
            <div class="section-title-row">
              <h3>Últimos Pedidos</h3>
              <a routerLink="/admin/pedidos" class="text-gold">Ver todos →</a>
            </div>
            <table class="data-table">
              <thead>
                <tr><th>ID</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                @for (pedido of recentOrders(); track pedido.$id) {
                  <tr>
                    <td>#{{ pedido.$id.slice(-6).toUpperCase() }}</td>
                    <td>{{ pedido.clienteNome }}</td>
                    <td>{{ formatDate(pedido.$createdAt) }}</td>
                    <td class="text-gold">R$ {{ pedido.valorTotal.toFixed(2) }}</td>
                    <td><span class="chip" [class]="'chip-' + pedidoService.getStatusChipColor(pedido.status)">{{ pedidoService.getStatusLabel(pedido.status) }}</span></td>
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
              @for (produto of topProducts(); track produto.$id; let i = $index) {
                <div class="top-product">
                  <span class="top-rank">{{ i + 1 }}°</span>
                  <span class="top-suit">♠</span>
                  <div class="top-info">
                    <span class="top-name">{{ produto.nome }}</span>
                    <span class="top-sales text-muted">Estoque: {{ produto.estoque }}</span>
                  </div>
                  <span class="top-revenue text-gold">R$ {{ produto.preco.toFixed(2) }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  loading = signal(true);
  totalVendas = signal(0);
  pedidosPendentes = signal(0);
  baixoEstoque = signal(0);
  totalProdutos = signal(0);
  recentOrders = signal<Pedido[]>([]);
  topProducts = signal<Produto[]>([]);

  private realtimeSub: Subscription | null = null;

  constructor(
    public pedidoService: PedidoService,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(event => {
      if (event.collection === 'pedidos' || event.collection === 'produtos') {
        this.loadDashboard();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
    this.realtimeService.disconnect();
  }

  async loadDashboard(): Promise<void> {
    this.loading.set(true);
    try {
      const [allPedidosResult, pendentesResult, produtosResult, baixoEstoqueResult] = await Promise.all([
        this.pedidoService.listarAdmin(100, 0),
        this.pedidoService.listarAdmin(100, 0, 'pendente'),
        this.produtoService.listarAdmin(100, 0),
        this.produtoService.listarAdmin(100, 0)
      ]);

      const soma = allPedidosResult.documents.reduce((acc, p) => acc + p.valorTotal, 0);
      this.totalVendas.set(soma);

      this.pedidosPendentes.set(pendentesResult.total);

      const countBaixoEstoque = baixoEstoqueResult.documents.filter(p => p.estoque <= 5).length;
      this.baixoEstoque.set(countBaixoEstoque);

      this.totalProdutos.set(produtosResult.total);

      const recentes = allPedidosResult.documents.slice(0, 5);
      this.recentOrders.set(recentes);

      const sorted = [...produtosResult.documents].sort((a, b) => b.estoque - a.estoque);
      this.topProducts.set(sorted.slice(0, 5));
    } catch {
      this.totalVendas.set(0);
      this.pedidosPendentes.set(0);
      this.baixoEstoque.set(0);
      this.totalProdutos.set(0);
      this.recentOrders.set([]);
      this.topProducts.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
