import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-title-row">
        <h1 class="page-title">Categorias</h1>
        <button class="btn-casino btn-primary" (click)="abrirModalCriar()">+ Nova Categoria</button>
      </div>

      <div class="casino-card">
        <table class="casino-table" *ngIf="categorias().length > 0; else vazio">
          <thead>
            <tr>
              <th>Icone</th>
              <th>Nome</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of categorias(); track cat.$id) {
              <tr>
                <td><span class="cat-suit">{{ cat.icone }}</span></td>
                <td>{{ cat.nome }}</td>
                <td class="acoes-col">
                  <button class="btn-casino btn-edit" (click)="abrirModalEditar(cat)">Editar</button>
                  <button class="btn-casino btn-danger" (click)="deletar(cat)">Excluir</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <ng-template #vazio>
          <div class="empty-state">Nenhuma categoria encontrada.</div>
        </ng-template>
      </div>

      @if (modalAberto()) {
        <div class="modal-backdrop" (click)="fecharModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="modal-title">{{ modoEdicao() ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
              <button class="modal-close" (click)="fecharModal()">x</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Nome</label>
                <input
                  class="form-input"
                  type="text"
                  [(ngModel)]="form.nome"
                  placeholder="Nome da categoria"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Icone</label>
                <input
                  class="form-input"
                  type="text"
                  [(ngModel)]="form.icone"
                  placeholder="Emoji ou simbolo (ex: ♠)"
                />
                @if (form.icone) {
                  <div class="icone-preview">
                    <span class="cat-suit">{{ form.icone }}</span>
                  </div>
                }
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-casino btn-secondary" (click)="fecharModal()">Cancelar</button>
              <button class="btn-casino btn-primary" (click)="salvar()" [disabled]="salvando()">
                {{ salvando() ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f0c040;
      text-shadow: 0 0 10px rgba(240, 192, 64, 0.4);
      margin: 0;
    }

    .cat-suit {
      font-size: 1.5rem;
      display: inline-block;
      line-height: 1;
      color: #f0c040;
      text-shadow: 0 0 8px rgba(240, 192, 64, 0.6);
    }

    .admin-page {
      padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a1a 0%, #12122a 100%);
    }

    .casino-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(240, 192, 64, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    }

    .casino-table {
      width: 100%;
      border-collapse: collapse;
    }

    .casino-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      color: #f0c040;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid rgba(240, 192, 64, 0.2);
    }

    .casino-table td {
      padding: 0.85rem 1rem;
      color: #e0e0e0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .casino-table tr:last-child td {
      border-bottom: none;
    }

    .casino-table tr:hover td {
      background: rgba(240, 192, 64, 0.05);
    }

    .acoes-col {
      display: flex;
      gap: 0.5rem;
    }

    .btn-casino {
      padding: 0.45rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-casino:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f0c040, #d4a020);
      color: #0a0a1a;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #f5d060, #e0b030);
      box-shadow: 0 0 12px rgba(240, 192, 64, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #e0e0e0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
    }

    .btn-edit {
      background: rgba(64, 160, 240, 0.15);
      color: #40a0f0;
      border: 1px solid rgba(64, 160, 240, 0.3);
    }

    .btn-edit:hover {
      background: rgba(64, 160, 240, 0.25);
      box-shadow: 0 0 8px rgba(64, 160, 240, 0.3);
    }

    .btn-danger {
      background: rgba(240, 64, 64, 0.15);
      color: #f04040;
      border: 1px solid rgba(240, 64, 64, 0.3);
    }

    .btn-danger:hover {
      background: rgba(240, 64, 64, 0.25);
      box-shadow: 0 0 8px rgba(240, 64, 64, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: rgba(224, 224, 224, 0.4);
      font-size: 1rem;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: linear-gradient(135deg, #12122a 0%, #1a1a35 100%);
      border: 1px solid rgba(240, 192, 64, 0.3);
      border-radius: 14px;
      width: 100%;
      max-width: 460px;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(240, 192, 64, 0.1);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(240, 192, 64, 0.15);
    }

    .modal-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #f0c040;
    }

    .modal-close {
      background: none;
      border: none;
      color: rgba(224, 224, 224, 0.5);
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: color 0.2s;
    }

    .modal-close:hover {
      color: #f0c040;
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: rgba(224, 224, 224, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.65rem 0.9rem;
      color: #e0e0e0;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
      border-color: rgba(240, 192, 64, 0.5);
      box-shadow: 0 0 0 3px rgba(240, 192, 64, 0.1);
    }

    .form-input::placeholder {
      color: rgba(224, 224, 224, 0.3);
    }

    .icone-preview {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class CategoriasComponent implements OnInit, OnDestroy {
  categorias = signal<Categoria[]>([]);
  modalAberto = signal(false);
  modoEdicao = signal(false);
  salvando = signal(false);

  form: { nome: string; icone: string } = { nome: '', icone: '' };
  private editandoId: string | null = null;
  private realtimeSub: Subscription | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private toastService: ToastService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.realtimeService.connect();
    this.realtimeSub = this.realtimeService.changes$.subscribe(() => {
      this.carregar();
    });
  }

  ngOnDestroy(): void {
    this.realtimeService.disconnect();
    if (this.realtimeSub) {
      this.realtimeSub.unsubscribe();
    }
  }

  private async carregar(): Promise<void> {
    try {
      const lista = await this.categoriaService.listar();
      this.categorias.set(lista);
    } catch {
      this.toastService.erro('Erro ao carregar categorias.');
    }
  }

  abrirModalCriar(): void {
    this.form = { nome: '', icone: '' };
    this.editandoId = null;
    this.modoEdicao.set(false);
    this.modalAberto.set(true);
  }

  abrirModalEditar(cat: Categoria): void {
    this.form = { nome: cat.nome, icone: cat.icone };
    this.editandoId = cat.$id;
    this.modoEdicao.set(true);
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.editandoId = null;
  }

  async salvar(): Promise<void> {
    if (!this.form.nome.trim() || !this.form.icone.trim()) {
      this.toastService.erro('Preencha todos os campos.');
      return;
    }

    this.salvando.set(true);
    try {
      if (this.modoEdicao() && this.editandoId) {
        await this.categoriaService.atualizar(this.editandoId, { nome: this.form.nome, icone: this.form.icone });
        this.toastService.sucesso('Categoria atualizada com sucesso.');
      } else {
        await this.categoriaService.criar({ nome: this.form.nome, icone: this.form.icone });
        this.toastService.sucesso('Categoria criada com sucesso.');
      }
      this.fecharModal();
      await this.carregar();
    } catch {
      this.toastService.erro('Erro ao salvar categoria.');
    } finally {
      this.salvando.set(false);
    }
  }

  async deletar(cat: Categoria): Promise<void> {
    const confirmado = window.confirm(`Deseja excluir a categoria "${cat.nome}"?`);
    if (!confirmado) return;

    try {
      await this.categoriaService.deletar(cat.$id);
      this.toastService.sucesso('Categoria excluida com sucesso.');
      await this.carregar();
    } catch {
      this.toastService.erro('Erro ao excluir categoria.');
    }
  }
}
