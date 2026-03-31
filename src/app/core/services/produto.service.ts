import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { ID, Query } from 'appwrite';

export interface Produto {
  $id: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_promocional: number;
  categoria_id: string;
  imagens: string[];
  tamanhos: string[];
  cores: string[];
  estoque: number;
  destaque: boolean;
  ativo: boolean;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(private appwrite: AppwriteService) {}

  async listar(limit = 25, offset = 0, categoriaId?: string, busca?: string): Promise<{ documents: Produto[], total: number }> {
    const queries: string[] = [
      Query.equal('ativo', true),
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt')
    ];

    if (categoriaId) {
      queries.push(Query.equal('categoria_id', categoriaId));
    }
    if (busca) {
      queries.push(Query.search('nome', busca));
    }

    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      queries
    );
    return { documents: response.documents as unknown as Produto[], total: response.total };
  }

  async getById(id: string): Promise<Produto> {
    const doc = await this.appwrite.databases.getDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      id
    );
    return doc as unknown as Produto;
  }

  async getBySlug(slug: string): Promise<Produto | null> {
    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      [Query.equal('slug', slug), Query.limit(1)]
    );
    return response.documents.length > 0 ? response.documents[0] as unknown as Produto : null;
  }

  async getDestaques(): Promise<Produto[]> {
    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      [Query.equal('destaque', true), Query.equal('ativo', true), Query.limit(8)]
    );
    return response.documents as unknown as Produto[];
  }

  async criar(produto: Partial<Produto>): Promise<Produto> {
    const doc = await this.appwrite.databases.createDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      ID.unique(),
      produto
    );
    return doc as unknown as Produto;
  }

  async atualizar(id: string, data: Partial<Produto>): Promise<Produto> {
    const doc = await this.appwrite.databases.updateDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      id,
      data
    );
    return doc as unknown as Produto;
  }

  async deletar(id: string): Promise<void> {
    await this.appwrite.databases.deleteDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      id
    );
  }

  async uploadImagem(file: File): Promise<string> {
    const response = await this.appwrite.storage.createFile(
      this.appwrite.bucketId,
      ID.unique(),
      file
    );
    return response.$id;
  }

  async deleteImagem(fileId: string): Promise<void> {
    await this.appwrite.storage.deleteFile(this.appwrite.bucketId, fileId);
  }

  getImageUrl(fileId: string, width = 400, height = 500): string {
    return this.appwrite.getFilePreview(fileId, width, height);
  }

  // Admin: listar todos (incluindo inativos)
  async listarAdmin(limit = 10, offset = 0, busca?: string): Promise<{ documents: Produto[], total: number }> {
    const queries: string[] = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt')
    ];
    if (busca) {
      queries.push(Query.search('nome', busca));
    }

    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.produtos,
      queries
    );
    return { documents: response.documents as unknown as Produto[], total: response.total };
  }
}
