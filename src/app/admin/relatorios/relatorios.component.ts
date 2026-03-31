import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PedidoService, Pedido } from '../../core/services/pedido.service';
import { ProdutoService, Produto } from '../../core/services/produto.service';
import { CategoriaService, Categoria } from '../../core/services/categoria.service';
import { RealtimeService } from '../../core/services/realtime.service';

interface StatusBar {
  label: string;
  count: number;
  pct: number;
}

interface CategoriaBar {
  nome: string;
  count: number;
  pct: number;
}

interface RankingProduto {
  nome: string;
  preco: number;
  rank: number;
}

@Component({
  selector: 'app-admin-relatorios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Relatorios</h1>

      @if (loading()) {
        <div class="loading-state">
          <span class="text-gold">Carregando relatorios...</span>
        </div>
      } @else {
        <div class="reports-grid">

          <div class="report-card">
            <h3>Vendas por Status</h3>
            <div class="report-chart-placeholder">
              @for (bar of statusBars(); track bar.label) {
                <div class="chart-bar-wrap">
                  <div class="chart-bar" [style.height.%]="bar.pct || 5">
                    <span class="bar-count">{{ bar.count }}</span>
                  </div>
                  <span class="bar-label">{{ bar.label }}</span>
                </div>
              }
            </div>
          </div>

          <div class="report-card">
            <h3>Vendas por Categoria</h3>
            <div class="category-stats">
              @if (categoriasBars().length === 0) {
                <span class="text-muted" style="font-size:0.85rem;">Sem dados de categoria.</span>
              } @else {
                @for (cat of categoriasBars(); track cat.nome) {
                  <div class="cat-stat">
                    <div class="cat-stat-header">
                      <span>{{ cat.nome }}</span>
                      <span class="text-gold">{{ cat.pct }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-bar-fill" [style.width.%]="cat.pct"></div>
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <div class="report-card">
            <h3>Metricas do Mes</h3>
            <div class="metric-list">
              <div class="metric-row">
                <span>Ticket Medio</span>
                <span class="text-gold">R$ {{ ticketMedio().toFixed(2) }}</span>
              </div>
              <div class="metric-row">
                <span>Total Vendas</span>
                <span class="text-gold">R$ {{ totalVendas().toFixed(2) }}</span>
              </div>
              <div class="metric-row">
                <span>Total Pedidos</span>
                <span class="text-gold">{{ totalPedidos() }}</span>
              </div>
              <div class="metric-row">
                <span>Pedidos Cancelados</span>
                <span class="text-red">{{ canceladosPct().toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <div class="report-card">
            <h3>Ranking Produtos</h3>
            <div class="metric-list">
              @if (rankingProdutos().length === 0) {
                <span class="text-muted" style="font-size:0.85rem;">Sem produtos.</span>
              } @else {
                @for (prod of rankingProdutos(); track prod.rank) {
                  <div class="metric-row">
                    <span>{{ prod.rank }}° {{ prod.nome }}</span>
                    <span class="text-gold">R$ {{ prod.preco.toFixed(2) }}</span>
                  </div>
                }
              }
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 1.5rem; }
    @media (min-width: 768px) { h1 { margin-bottom: 2rem; } }
    .reports-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 768px) { .reports-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
    .report-card { background: var(--color-black); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: var(--radius-lg); padding: 1.25rem; }
    @media (min-width: 768px) { .report-card { padding: 2rem; } }
    .report-card h3 { font-size: 0.9rem; color: var(--color-gold); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
    @media (min-width: 768px) { .report-card h3 { font-size: 1rem; margin-bottom: 1.5rem; } }
    .report-chart-placeholder { display: flex; align-items: flex-end; gap: 0.35rem; height: 120px; padding-top: 1rem; padding-bottom: 1.5rem; }
    @media (min-width: 768px) { .report-chart-placeholder { gap: 0.5rem; height: 150px; } }
    .chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; }
    .chart-bar { width: 100%; background: linear-gradient(180deg, var(--color-gold), var(--color-gold-dark)); border-radius: var(--radius-sm) var(--radius-sm) 0 0; min-height: 10px; position: relative; transition: height 0.5s ease; display: flex; align-items: flex-start; justify-content: center; }
    .bar-count { font-size: 0.6rem; color: var(--color-black); font-weight: 700; padding-top: 2px; }
    .bar-label { font-size: 0.6rem; color: var(--color-text-muted); white-space: nowrap; margin-top: 0.25rem; }
    @media (min-width: 768px) { .bar-label { font-size: 0.65rem; } }
    .category-stats { display: flex; flex-direction: column; gap: 1rem; }
    @media (min-width: 768px) { .category-stats { gap: 1.25rem; } }
    .cat-stat-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; }
    @media (min-width: 768px) { .cat-stat-header { font-size: 0.9rem; } }
    .progress-bar { background: rgba(255,255,255,0.07); border-radius: 999px; height: 6px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-gold), var(--color-gold-dark)); border-radius: 999px; transition: width 0.5s ease; }
    .metric-list { display: flex; flex-direction: column; gap: 0.75rem; }
    @media (min-width: 768px) { .metric-list { gap: 1rem; } }
    .metric-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    @media (min-width: 768px) { .metric-row { font-size: 0.9rem; padding: 0.5rem 0; } }
  `]
})
export class AdminRelatoriosComponent implements OnInit, OnDestroy {
  loading = signal(true);
  statusBars = signal<StatusBar[]>([]);
  categoriasBars = signal<CategoriaBar[]>([]);
  ticketMedio = signal(0);
  totalVendas = signal(0);
  totalPedidos = signal(0);
  canceladosPct = signal(0);
  rankingProdutos = signal<RankingProduto[]>([]);

  private realtimeSub: Subscription | null = null;

  private readonly STATUS_LABELS: Record<string, string> = {
    pendente: 'Pendente',
    confirmado: 'Confirmado',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado'
  };

  constructor(
    private pedidoService: PedidoService,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.loadRelatorios();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(event => {
      if (event.collection === 'pedidos' || event.collection === 'produtos') {
        this.loadRelatorios();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
    this.realtimeService.disconnect();
  }

  async loadRelatorios(): Promise<void> {
    this.loading.set(true);
    try {
      const [pedidosResult, produtosResult, categorias] = await Promise.all([
        this.pedidoService.listarAdmin(100, 0),
        this.produtoService.listarAdmin(100, 0),
        this.categoriaService.listar()
      ]);

      const pedidos: Pedido[] = pedidosResult.documents;
      const produtos: Produto[] = produtosResult.documents;

      this.buildStatusBars(pedidos);
      this.buildMetricas(pedidos);
      this.buildCategoriasBars(produtos, categorias);
      this.buildRanking(produtos);
    } catch {
      this.statusBars.set([]);
      this.categoriasBars.set([]);
      this.ticketMedio.set(0);
      this.totalVendas.set(0);
      this.totalPedidos.set(0);
      this.canceladosPct.set(0);
      this.rankingProdutos.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private buildStatusBars(pedidos: Pedido[]): void {
    const statusKeys = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    const counts = new Map<string, number>();
    for (const key of statusKeys) counts.set(key, 0);
    for (const pedido of pedidos) {
      const cur = counts.get(pedido.status) ?? 0;
      counts.set(pedido.status, cur + 1);
    }
    const max = Math.max(...Array.from(counts.values()), 1);
    const bars: StatusBar[] = statusKeys.map(key => ({
      label: this.STATUS_LABELS[key] ?? key,
      count: counts.get(key) ?? 0,
      pct: Math.round(((counts.get(key) ?? 0) / max) * 100)
    }));
    this.statusBars.set(bars);
  }

  private buildMetricas(pedidos: Pedido[]): void {
    const total = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);
    const count = pedidos.length;
    const cancelados = pedidos.filter(p => p.status === 'cancelado').length;
    this.totalVendas.set(total);
    this.totalPedidos.set(count);
    this.ticketMedio.set(count > 0 ? total / count : 0);
    this.canceladosPct.set(count > 0 ? (cancelados / count) * 100 : 0);
  }

  private buildCategoriasBars(produtos: Produto[], categorias: Categoria[]): void {
    const catMap = new Map<string, string>();
    for (const cat of categorias) catMap.set(cat.$id, cat.nome);

    const counts = new Map<string, number>();
    for (const produto of produtos) {
      const catId = produto.categoriaId || 'sem-categoria';
      counts.set(catId, (counts.get(catId) ?? 0) + 1);
    }

    const total = produtos.length || 1;
    const bars: CategoriaBar[] = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([catId, count]) => ({
        nome: catMap.get(catId) ?? 'Outros',
        count,
        pct: Math.round((count / total) * 100)
      }));

    this.categoriasBars.set(bars);
  }

  private buildRanking(produtos: Produto[]): void {
    const top5 = produtos.slice(0, 5).map((prod, i) => ({
      rank: i + 1,
      nome: prod.nome,
      preco: prod.preco
    }));
    this.rankingProdutos.set(top5);
  }
}
