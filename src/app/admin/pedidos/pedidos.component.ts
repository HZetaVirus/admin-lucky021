import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PedidoService, Pedido } from '../../services/pedido.service';
import { ToastService } from '../../services/toast.service';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="casino-page">
      <div class="casino-header">
        <h1 class="casino-title">Gerenciar Pedidos</h1>
      </div>

      <div class="status-filter-chips">
        @for (s of statusOptions; track s.value) {
          <button
            class="chip"
            [class.chip-active]="filtroStatus() === s.value"
            (click)="setFiltro(s.value)"
          >
            {{ s.label }}
            <span class="chip-count">{{ getCount(s.value) }}</span>
          </button>
        }
      </div>

      <div class="casino-card">
        @if (carregando()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <span>Carregando pedidos...</span>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="casino-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                @for (pedido of pedidosPaginados(); track pedido.$id) {
                  <tr class="table-row">
                    <td class="id-cell">{{ pedido.$id.slice(0, 8) }}...</td>
                    <td>{{ pedido.clienteNome }}</td>
                    <td>{{ formatarData(pedido.$createdAt) }}</td>
                    <td class="valor-cell">R$ {{ pedido.valorTotal.toFixed(2) }}</td>
                    <td>
                      <span
                        class="status-chip"
                        [ngClass]="pedidoService.getStatusChipColor(pedido.status)"
                      >
                        {{ pedidoService.getStatusLabel(pedido.status) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-detalhes" (click)="abrirModal(pedido)">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="empty-state">Nenhum pedido encontrado.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <button
              class="btn-page"
              [disabled]="paginaAtual() === 0"
              (click)="paginaAnterior()"
            >
              Anterior
            </button>
            <span class="page-info">
              Pagina {{ paginaAtual() + 1 }} de {{ totalPaginas() }}
            </span>
            <button
              class="btn-page"
              [disabled]="paginaAtual() >= totalPaginas() - 1"
              (click)="proximaPagina()"
            >
              Proxima
            </button>
          </div>
        }
      </div>
    </div>

    @if (modalAberto()) {
      <div class="modal-overlay" (click)="fecharModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Detalhes do Pedido</h2>
            <button class="btn-fechar" (click)="fecharModal()">x</button>
          </div>

          @if (pedidoSelecionado(); as p) {
            <div class="modal-body">
              <div class="detail-row">
                <span class="detail-label">ID:</span>
                <span class="detail-value">{{ p.$id }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Cliente:</span>
                <span class="detail-value">{{ p.clienteNome }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data:</span>
                <span class="detail-value">{{ formatarData(p.$createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value valor-cell">R$ {{ p.valorTotal.toFixed(2) }}</span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <select
                  class="status-select"
                  [(ngModel)]="novoStatus"
                  [disabled]="atualizando()"
                >
                  @for (s of statusOpcoes; track s.value) {
                    <option [value]="s.value">{{ s.label }}</option>
                  }
                </select>
              </div>

              <div class="detail-section">
                <span class="detail-label">Itens:</span>
                <ul class="itens-list">
                  @for (item of parsedItens(); track $index) {
                    <li class="item-entry">
                      <span>{{ item.nome }}</span>
                      <span>x{{ item.quantidade }}</span>
                      <span>R$ {{ item.preco?.toFixed(2) }}</span>
                    </li>
                  } @empty {
                    <li class="item-entry">Sem itens</li>
                  }
                </ul>
              </div>

              <div class="detail-section">
                <span class="detail-label">Endereco:</span>
                @if (parsedEndereco(); as end) {
                  <div class="endereco-box">
                    @if (end.rua) {
                      <div>{{ end.rua }}, {{ end.numero }}</div>
                    }
                    @if (end.bairro) {
                      <div>{{ end.bairro }}</div>
                    }
                    @if (end.cidade) {
                      <div>{{ end.cidade }} - {{ end.estado }}</div>
                    }
                    @if (end.cep) {
                      <div>CEP: {{ end.cep }}</div>
                    }
                  </div>
                } @else {
                  <span class="detail-value">{{ pedidoSelecionado()?.endereco }}</span>
                }
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-cancelar" (click)="fecharModal()" [disabled]="atualizando()">
                Cancelar
              </button>
              <button
                class="btn-salvar"
                (click)="salvarStatus()"
                [disabled]="atualizando() || novoStatus === p.status"
              >
                @if (atualizando()) {
                  Salvando...
                } @else {
                  Salvar Status
                }
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .casino-page { padding: 24px; }
    .casino-header { margin-bottom: 20px; }
    .casino-title { font-size: 1.8rem; font-weight: 700; color: #f5c518; }
    .status-filter-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .chip {
      padding: 6px 14px; border-radius: 20px; border: 1px solid #444;
      background: #1a1a2e; color: #ccc; cursor: pointer; font-size: 0.85rem;
      display: flex; align-items: center; gap: 6px; transition: all 0.2s;
    }
    .chip:hover { border-color: #f5c518; color: #f5c518; }
    .chip-active { background: #f5c518; color: #1a1a2e; border-color: #f5c518; font-weight: 600; }
    .chip-count {
      background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1px 7px; font-size: 0.75rem;
    }
    .chip-active .chip-count { background: rgba(0,0,0,0.15); }
    .casino-card {
      background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 12px;
      padding: 20px; overflow: hidden;
    }
    .loading-state {
      display: flex; align-items: center; gap: 12px; color: #ccc; padding: 40px; justify-content: center;
    }
    .spinner {
      width: 20px; height: 20px; border: 2px solid #444; border-top-color: #f5c518;
      border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .table-wrapper { overflow-x: auto; }
    .casino-table { width: 100%; border-collapse: collapse; }
    .casino-table th {
      text-align: left; padding: 12px 14px; color: #f5c518; font-size: 0.85rem;
      border-bottom: 1px solid #2d2d4e; white-space: nowrap;
    }
    .table-row td { padding: 12px 14px; border-bottom: 1px solid #2d2d4e; color: #e0e0e0; font-size: 0.9rem; }
    .table-row:hover td { background: #22224a; }
    .id-cell { font-family: monospace; color: #aaa; }
    .valor-cell { color: #4caf50; font-weight: 600; }
    .empty-state { text-align: center; color: #666; padding: 40px; }
    .status-chip {
      padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; white-space: nowrap;
    }
    .btn-detalhes {
      padding: 5px 14px; background: transparent; border: 1px solid #f5c518;
      color: #f5c518; border-radius: 6px; cursor: pointer; font-size: 0.82rem; transition: all 0.2s;
    }
    .btn-detalhes:hover { background: #f5c518; color: #1a1a2e; }
    .pagination {
      display: flex; align-items: center; justify-content: center; gap: 16px;
      margin-top: 20px; padding-top: 16px; border-top: 1px solid #2d2d4e;
    }
    .btn-page {
      padding: 7px 18px; background: #2d2d4e; border: 1px solid #444;
      color: #ccc; border-radius: 6px; cursor: pointer; transition: all 0.2s;
    }
    .btn-page:hover:not(:disabled) { border-color: #f5c518; color: #f5c518; }
    .btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { color: #aaa; font-size: 0.88rem; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
      background: #1a1a2e; border: 1px solid #2d2d4e; border-radius: 14px;
      width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 22px; border-bottom: 1px solid #2d2d4e;
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; color: #f5c518; }
    .btn-fechar {
      background: transparent; border: none; color: #aaa; font-size: 1.2rem;
      cursor: pointer; padding: 4px 8px; border-radius: 4px;
    }
    .btn-fechar:hover { color: #fff; background: #2d2d4e; }
    .modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
    .detail-row { display: flex; align-items: center; gap: 10px; }
    .detail-label { color: #f5c518; font-weight: 600; min-width: 80px; font-size: 0.88rem; }
    .detail-value { color: #e0e0e0; font-size: 0.9rem; word-break: break-all; }
    .status-select {
      background: #2d2d4e; border: 1px solid #444; color: #e0e0e0;
      padding: 6px 10px; border-radius: 6px; font-size: 0.88rem; cursor: pointer;
    }
    .status-select:focus { outline: none; border-color: #f5c518; }
    .detail-section { display: flex; flex-direction: column; gap: 8px; }
    .itens-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
    .item-entry {
      display: flex; gap: 12px; background: #22224a; padding: 8px 12px;
      border-radius: 6px; color: #e0e0e0; font-size: 0.87rem; align-items: center;
    }
    .endereco-box {
      background: #22224a; padding: 10px 14px; border-radius: 8px;
      color: #e0e0e0; font-size: 0.87rem; display: flex; flex-direction: column; gap: 4px;
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 10px;
      padding: 16px 22px; border-top: 1px solid #2d2d4e;
    }
    .btn-cancelar {
      padding: 8px 20px; background: transparent; border: 1px solid #555;
      color: #ccc; border-radius: 6px; cursor: pointer;
    }
    .btn-cancelar:hover:not(:disabled) { border-color: #aaa; color: #fff; }
    .btn-salvar {
      padding: 8px 22px; background: #f5c518; border: none;
      color: #1a1a2e; border-radius: 6px; cursor: pointer; font-weight: 700; transition: opacity 0.2s;
    }
    .btn-salvar:hover:not(:disabled) { opacity: 0.85; }
    .btn-salvar:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class PedidosComponent implements OnInit, OnDestroy {
  private realtimeSub: Subscription | null = null;

  carregando = signal(true);
  atualizando = signal(false);
  modalAberto = signal(false);
  pedidoSelecionado = signal<Pedido | null>(null);
  novoStatus = '';

  todosPedidos = signal<Pedido[]>([]);
  filtroStatus = signal<string>('todos');
  paginaAtual = signal(0);
  readonly itensPorPagina = 10;

  statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  statusOpcoes = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  pedidosFiltrados = computed(() => {
    const status = this.filtroStatus();
    const todos = this.todosPedidos();
    if (status === 'todos') return todos;
    return todos.filter(p => p.status === status);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.pedidosFiltrados().length / this.itensPorPagina))
  );

  pedidosPaginados = computed(() => {
    const inicio = this.paginaAtual() * this.itensPorPagina;
    return this.pedidosFiltrados().slice(inicio, inicio + this.itensPorPagina);
  });

  parsedItens = computed(() => {
    const p = this.pedidoSelecionado();
    if (!p) return [];
    try {
      return JSON.parse(p.itens);
    } catch {
      return [];
    }
  });

  parsedEndereco = computed(() => {
    const p = this.pedidoSelecionado();
    if (!p) return null;
    try {
      return JSON.parse(p.endereco);
    } catch {
      return null;
    }
  });

  constructor(
    public pedidoService: PedidoService,
    private toastService: ToastService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.carregarTodos();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(() => {
      this.carregarTodos();
    });
  }

  ngOnDestroy(): void {
    this.realtimeService.disconnect();
    this.realtimeSub?.unsubscribe();
  }

  async carregarTodos(): Promise<void> {
    this.carregando.set(true);
    try {
      let todos: Pedido[] = [];
      let offset = 0;
      const batchSize = 100;
      while (true) {
        const lote = await this.pedidoService.listarAdmin(batchSize, offset);
        todos = todos.concat(lote);
        if (lote.length < batchSize) break;
        offset += batchSize;
      }
      this.todosPedidos.set(todos);
      this.paginaAtual.set(0);
    } catch {
      this.toastService.erro('Erro ao carregar pedidos.');
    } finally {
      this.carregando.set(false);
    }
  }

  setFiltro(status: string): void {
    this.filtroStatus.set(status);
    this.paginaAtual.set(0);
  }

  getCount(status: string): number {
    const todos = this.todosPedidos();
    if (status === 'todos') return todos.length;
    return todos.filter(p => p.status === status).length;
  }

  formatarData(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  abrirModal(pedido: Pedido): void {
    this.pedidoSelecionado.set(pedido);
    this.novoStatus = pedido.status;
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.pedidoSelecionado.set(null);
    this.novoStatus = '';
  }

  async salvarStatus(): Promise<void> {
    const pedido = this.pedidoSelecionado();
    if (!pedido || this.novoStatus === pedido.status) return;
    this.atualizando.set(true);
    try {
      await this.pedidoService.atualizarStatus(pedido.$id, this.novoStatus);
      this.toastService.sucesso('Status atualizado com sucesso.');
      this.todosPedidos.update(lista =>
        lista.map(p => p.$id === pedido.$id ? { ...p, status: this.novoStatus } : p)
      );
      this.fecharModal();
    } catch {
      this.toastService.erro('Erro ao atualizar status.');
    } finally {
      this.atualizando.set(false);
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual() > 0) {
      this.paginaAtual.update(p => p - 1);
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual() < this.totalPaginas() - 1) {
      this.paginaAtual.update(p => p + 1);
    }
  }
}
