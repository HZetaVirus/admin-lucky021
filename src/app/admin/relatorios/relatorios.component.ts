import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-relatorios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Relatórios</h1>

      <div class="reports-grid">
        <div class="report-card">
          <h3>💰 Vendas por Período</h3>
          <div class="report-chart-placeholder">
            @for (bar of barsVendas; track bar.label) {
            <div class="chart-bar" [style.height.%]="bar.pct">
              <span class="bar-label">{{ bar.label }}</span>
            </div>
            }
          </div>
          <p class="text-muted" style="margin-top:1rem;">Total: <strong class="text-gold">R$ 45.890,00</strong></p>
        </div>

        <div class="report-card">
          <h3>👕 Vendas por Categoria</h3>
          <div class="category-stats">
            @for (cat of categoryStats; track cat.nome) {
              <div class="cat-stat">
                <div class="cat-stat-header">
                  <span [class]="cat.suitColor">{{ cat.suit }} {{ cat.nome }}</span>
                  <span class="text-gold">{{ cat.pct }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" [style.width.%]="cat.pct"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="report-card">
          <h3>📈 Métricas do Mês</h3>
          <div class="metric-list">
            <div class="metric-row"><span>Ticket Médio</span><span class="text-gold">R$ 287,40</span></div>
            <div class="metric-row"><span>Taxa de Conversão</span><span class="text-gold">3.2%</span></div>
            <div class="metric-row"><span>Pedidos Cancelados</span><span class="text-red">4.1%</span></div>
            <div class="metric-row"><span>Clientes Recorrentes</span><span class="text-gold">28%</span></div>
          </div>
        </div>

        <div class="report-card">
          <h3>🏆 Ranking de Produtos</h3>
          <div class="metric-list">
            <div class="metric-row"><span>1° Camiseta Royal Flush</span><span class="text-gold">234 un.</span></div>
            <div class="metric-row"><span>2° Calça Dealer</span><span class="text-gold">189 un.</span></div>
            <div class="metric-row"><span>3° Jaqueta All-In</span><span class="text-gold">156 un.</span></div>
            <div class="metric-row"><span>4° Moletom Jackpot</span><span class="text-gold">145 un.</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 1.5rem; }
    @media (min-width: 768px) { h1 { margin-bottom: 2rem; } }
    .reports-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 768px) { .reports-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
    .report-card { background: var(--color-black); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: var(--radius-lg); padding: 1.25rem; }
    @media (min-width: 768px) { .report-card { padding: 2rem; } }
    .report-card h3 { font-size: 0.9rem; color: var(--color-gold); margin-bottom: 1rem; }
    @media (min-width: 768px) { .report-card h3 { font-size: 1rem; margin-bottom: 1.5rem; } }
    .report-chart-placeholder { display: flex; align-items: flex-end; gap: 0.35rem; height: 120px; padding-top: 1rem; }
    @media (min-width: 768px) { .report-chart-placeholder { gap: 0.5rem; height: 150px; } }
    .chart-bar { flex: 1; background: linear-gradient(180deg, var(--color-gold), var(--color-gold-dark)); border-radius: var(--radius-sm) var(--radius-sm) 0 0; min-height: 10px; position: relative; transition: height 0.5s ease; }
    .bar-label { position: absolute; bottom: -1.5rem; left: 50%; transform: translateX(-50%); font-size: 0.6rem; color: var(--color-text-muted); white-space: nowrap; }
    @media (min-width: 768px) { .bar-label { font-size: 0.65rem; } }
    .category-stats { display: flex; flex-direction: column; gap: 1rem; }
    @media (min-width: 768px) { .category-stats { gap: 1.25rem; } }
    .cat-stat-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; }
    @media (min-width: 768px) { .cat-stat-header { font-size: 0.9rem; } }
    .cat-stat-header .red { color: var(--color-red-bright); }
    .metric-list { display: flex; flex-direction: column; gap: 0.75rem; }
    @media (min-width: 768px) { .metric-list { gap: 1rem; } }
    .metric-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    @media (min-width: 768px) { .metric-row { font-size: 0.9rem; padding: 0.5rem 0; } }
  `]
})
export class AdminRelatoriosComponent {
  barsVendas = [
    { label: 'Seg', pct: 45 }, { label: 'Ter', pct: 62 }, { label: 'Qua', pct: 38 },
    { label: 'Qui', pct: 80 }, { label: 'Sex', pct: 95 }, { label: 'Sáb', pct: 70 }, { label: 'Dom', pct: 50 }
  ];
  categoryStats = [
    { nome: 'Camisetas', suit: '♠', suitColor: '', pct: 38 },
    { nome: 'Calças', suit: '♥', suitColor: 'red', pct: 25 },
    { nome: 'Jaquetas', suit: '♦', suitColor: 'red', pct: 22 },
    { nome: 'Acessórios', suit: '♣', suitColor: '', pct: 15 },
  ];
}
