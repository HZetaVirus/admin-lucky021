import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { ID, Query } from 'appwrite';

export interface Categoria {
  $id: string;
  nome: string;
  slug: string;
  descricao: string;
  icone_naipe: string;
  ativa: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  constructor(private appwrite: AppwriteService) {}

  async listar(): Promise<Categoria[]> {
    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      [Query.equal('ativa', true), Query.orderAsc('nome')]
    );
    return response.documents as unknown as Categoria[];
  }

  async listarAdmin(): Promise<Categoria[]> {
    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      [Query.orderAsc('nome'), Query.limit(100)]
    );
    return response.documents as unknown as Categoria[];
  }

  async getById(id: string): Promise<Categoria> {
    const doc = await this.appwrite.databases.getDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      id
    );
    return doc as unknown as Categoria;
  }

  async criar(categoria: Partial<Categoria>): Promise<Categoria> {
    const doc = await this.appwrite.databases.createDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      ID.unique(),
      categoria
    );
    return doc as unknown as Categoria;
  }

  async atualizar(id: string, data: Partial<Categoria>): Promise<Categoria> {
    const doc = await this.appwrite.databases.updateDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      id,
      data
    );
    return doc as unknown as Categoria;
  }

  async deletar(id: string): Promise<void> {
    await this.appwrite.databases.deleteDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.categorias,
      id
    );
  }
}
