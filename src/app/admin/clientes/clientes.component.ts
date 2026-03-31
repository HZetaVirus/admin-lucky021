import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PedidoService, Pedido } from '../../core/services/pedido.service';
import { RealtimeService } from '../../core/services/realtime.service';

interface ClienteAgrupado {
  clienteId: string;
  nome: string;
  totalPedidos: number;
  totalGasto: number;
}

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page page-enter">
      <h1>Clientes</h1>

      @if (loading()) {
        <div class="loading-state">
          <span class="text-gold">Carregando clientes...</span>
        </div>
      } @else {
        @if (clientes().length === 0) {
          <div class="loading-state">
            <span class="text-muted">Nenhum cliente encontrado.</span>
          </div>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Nome</th>
                <th>ID Cliente</th>
                <th>Pedidos</th>
                <th>Total Gasto</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of clientes(); track cliente.clienteId) {
                <tr>
                  <td>
                    <div class="client-avatar">{{ cliente.nome.charAt(0).toUpperCase() }}</div>
                  </td>
                  <td><strong>{{ cliente.nome }}</strong></td>
                  <td class="text-muted" style="font-size:0.8rem; font-family: monospace;">{{ cliente.clienteId }}</td>
                  <td>{{ cliente.totalPedidos }}</td>
                  <td class="text-gold">R$ {{ cliente.totalGasto.toFixed(2) }}</td>
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
    .client-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-gold);
      color: var(--color-black);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }
  `]
})
export class AdminClientesComponent implements OnInit, OnDestroy {
  loading = signal(true);
  clientes = signal<ClienteAgrupado[]>([]);

  private realtimeSub: Subscription | null = null;

  constructor(
    private pedidoService: PedidoService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(event => {
      if (event.collection === 'pedidos') {
        this.loadClientes();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
    this.realtimeService.disconnect();
  }

  async loadClientes(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.pedidoService.listarAdmin(100, 0);
      const pedidos: Pedido[] = result.documents;

      const map = new Map<string, ClienteAgrupado>();
      for (const pedido of pedidos) {
        const existing = map.get(pedido.clienteId);
        if (existing) {
          existing.totalPedidos += 1;
          existing.totalGasto += pedido.valorTotal;
        } else {
          map.set(pedido.clienteId, {
            clienteId: pedido.clienteId,
            nome: pedido.clienteNome,
            totalPedidos: 1,
            totalGasto: pedido.valorTotal
          });
        }
      }

      const lista = Array.from(map.values()).sort((a, b) => b.totalGasto - a.totalGasto);
      this.clientes.set(lista);
    } catch {
      this.clientes.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
