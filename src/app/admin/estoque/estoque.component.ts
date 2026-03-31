import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProdutoService, Produto } from '../../core/services/produto.service';
import { ToastService } from '../../core/services/toast.service';
import { RealtimeService } from '../../core/services/realtime.service';

@Component({
  selector: 'app-admin-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Controle de Estoque</h1>

      @if (loading()) {
        <div class="loading-state">
          <span class="text-gold">Carregando estoque...</span>
        </div>
      } @else {
        @if (produtos().length === 0) {
          <div class="loading-state">
            <span class="text-muted">Nenhum produto encontrado.</span>
          </div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (produto of produtos(); track produto.$id) {
                <tr [class.low-stock]="produto.estoque <= 5">
                  <td><strong>{{ produto.nome }}</strong></td>
                  <td>
                    <input
                      type="number"
                      class="form-input inline-input"
                      [class.error]="produto.estoque <= 5"
                      [ngModel]="produto.estoque"
                      (ngModelChange)="onEstoqueChange(produto, $event)"
                      (blur)="salvarEstoque(produto)"
                      min="0"
                    />
                  </td>
                  <td>
                    @if (produto.estoque === 0) {
                      <span class="chip chip-red">Esgotado</span>
                    } @else if (produto.estoque <= 5) {
                      <span class="chip chip-gold">Baixo</span>
                    } @else {
                      <span class="chip chip-green">Normal</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      }
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 1.5rem; }
    .inline-input { width: 80px; padding: 0.4rem 0.6rem; text-align: center; }
    .low-stock { background: rgba(231, 76, 60, 0.05); }
  `]
})
export class AdminEstoqueComponent implements OnInit, OnDestroy {
  loading = signal(true);
  produtos = signal<Produto[]>([]);

  private realtimeSub: Subscription | null = null;
  private pendingSave = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private produtoService: ProdutoService,
    private toastService: ToastService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.loadProdutos();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(event => {
      if (event.collection === 'produtos') {
        this.loadProdutos();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
    this.realtimeService.disconnect();
  }

  async loadProdutos(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.produtoService.listarAdmin(100, 0);
      this.produtos.set(result.documents);
    } catch {
      this.produtos.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  onEstoqueChange(produto: Produto, newValue: number): void {
    const lista = this.produtos();
    const idx = lista.findIndex(p => p.$id === produto.$id);
    if (idx === -1) return;
    const updated = [...lista];
    updated[idx] = { ...updated[idx], estoque: newValue };
    this.produtos.set(updated);
  }

  async salvarEstoque(produto: Produto): Promise<void> {
    const existing = this.pendingSave.get(produto.$id);
    if (existing) {
      clearTimeout(existing);
    }
    const timer = setTimeout(async () => {
      try {
        await this.produtoService.atualizar(produto.$id, { estoque: produto.estoque });
        this.toastService.sucesso('Estoque atualizado');
      } catch {
        this.toastService.erro('Erro ao atualizar estoque');
      } finally {
        this.pendingSave.delete(produto.$id);
      }
    }, 300);
    this.pendingSave.set(produto.$id, timer);
  }
}
