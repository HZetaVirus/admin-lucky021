import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../../services/produto.service';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { ToastService } from '../../services/toast.service';
import { RealtimeService } from '../../services/realtime.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit, OnDestroy {
  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingProduct = signal<Produto | null>(null);

  formData = signal<{
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    categoriaId: string;
    destaque: boolean;
    imagens: string[];
  }>({
    nome: '',
    descricao: '',
    preco: 0,
    estoque: 0,
    categoriaId: '',
    destaque: false,
    imagens: []
  });

  busca = signal('');
  filtroCategoria = signal('');
  currentPage = signal(0);
  limit = 10;
  total = signal(0);
  uploadingImage = signal(false);

  private realtimeSub?: Subscription;

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private toast: ToastService,
    private realtime: RealtimeService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarProdutos();
    this.realtime.connect();
    this.realtimeSub = this.realtime.changes$.subscribe(() => {
      this.carregarProdutos();
    });
  }

  ngOnDestroy(): void {
    this.realtimeSub?.unsubscribe();
    this.realtime.disconnect();
  }

  async carregarCategorias(): Promise<void> {
    try {
      const result = await this.categoriaService.listar();
      this.categorias.set(result);
    } catch {
      this.toast.erro('Erro ao carregar categorias');
    }
  }

  async carregarProdutos(): Promise<void> {
    this.loading.set(true);
    try {
      const offset = this.currentPage() * this.limit;
      const busca = this.busca().trim() || undefined;
      const result = await this.produtoService.listarAdmin(this.limit, offset, busca);
      this.produtos.set(result.documents ?? result);
      if (result.total !== undefined) {
        this.total.set(result.total);
      }
    } catch {
      this.toast.erro('Erro ao carregar produtos');
    } finally {
      this.loading.set(false);
    }
  }

  get produtosFiltrados(): Produto[] {
    const filtro = this.filtroCategoria();
    if (!filtro) return this.produtos();
    return this.produtos().filter(p => p.categoriaId === filtro);
  }

  get totalPages(): number {
    return Math.ceil(this.total() / this.limit);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onBuscaChange(value: string): void {
    this.busca.set(value);
    this.currentPage.set(0);
    this.carregarProdutos();
  }

  onFiltroCategoria(value: string): void {
    this.filtroCategoria.set(value);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.carregarProdutos();
  }

  prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.carregarProdutos();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages - 1) {
      this.currentPage.update(p => p + 1);
      this.carregarProdutos();
    }
  }

  getNomeCategoria(categoriaId: string): string {
    const cat = this.categorias().find(c => c.$id === categoriaId);
    return cat ? cat.nome : '-';
  }

  getImagemUrl(fileId: string): string {
    return this.produtoService.getImageUrl(fileId, 60, 60);
  }

  abrirFormNovo(): void {
    this.editingProduct.set(null);
    this.formData.set({
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoriaId: '',
      destaque: false,
      imagens: []
    });
    this.showForm.set(true);
  }

  abrirFormEditar(produto: Produto): void {
    this.editingProduct.set(produto);
    this.formData.set({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      categoriaId: produto.categoriaId,
      destaque: produto.destaque,
      imagens: [...(produto.imagens ?? [])]
    });
    this.showForm.set(true);
  }

  fecharForm(): void {
    this.showForm.set(false);
    this.editingProduct.set(null);
  }

  updateField<K extends keyof ReturnType<typeof this.formData>>(field: K, value: ReturnType<typeof this.formData>[K]): void {
    this.formData.update(f => ({ ...f, [field]: value }));
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.uploadingImage.set(true);
    try {
      const fileId = await this.produtoService.uploadImagem(file);
      this.formData.update(f => ({ ...f, imagens: [...f.imagens, fileId] }));
      this.toast.sucesso('Imagem carregada com sucesso');
    } catch {
      this.toast.erro('Erro ao fazer upload da imagem');
    } finally {
      this.uploadingImage.set(false);
      input.value = '';
    }
  }

  async removerImagem(fileId: string): Promise<void> {
    if (!window.confirm('Remover esta imagem?')) return;
    try {
      await this.produtoService.deleteImagem(fileId);
      this.formData.update(f => ({ ...f, imagens: f.imagens.filter(id => id !== fileId) }));
      this.toast.sucesso('Imagem removida');
    } catch {
      this.toast.erro('Erro ao remover imagem');
    }
  }

  async salvar(): Promise<void> {
    const data = this.formData();
    if (!data.nome.trim()) {
      this.toast.erro('Nome do produto e obrigatorio');
      return;
    }
    if (!data.categoriaId) {
      this.toast.erro('Selecione uma categoria');
      return;
    }
    this.loading.set(true);
    try {
      const editing = this.editingProduct();
      if (editing) {
        await this.produtoService.atualizar(editing.$id, data);
        this.toast.sucesso('Produto atualizado com sucesso');
      } else {
        await this.produtoService.criar(data);
        this.toast.sucesso('Produto criado com sucesso');
      }
      this.fecharForm();
      await this.carregarProdutos();
    } catch {
      this.toast.erro('Erro ao salvar produto');
    } finally {
      this.loading.set(false);
    }
  }

  async deletar(produto: Produto): Promise<void> {
    if (!window.confirm(`Excluir o produto "${produto.nome}"? Esta acao nao pode ser desfeita.`)) return;
    this.loading.set(true);
    try {
      await this.produtoService.deletar(produto.$id);
      this.toast.sucesso('Produto excluido com sucesso');
      await this.carregarProdutos();
    } catch {
      this.toast.erro('Erro ao excluir produto');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleDestaque(produto: Produto): Promise<void> {
    try {
      await this.produtoService.atualizar(produto.$id, { destaque: !produto.destaque });
      this.produtos.update(list =>
        list.map(p => p.$id === produto.$id ? { ...p, destaque: !p.destaque } : p)
      );
      this.toast.sucesso('Destaque atualizado');
    } catch {
      this.toast.erro('Erro ao atualizar destaque');
    }
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  }
}
