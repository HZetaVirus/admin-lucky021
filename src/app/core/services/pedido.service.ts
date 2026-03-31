import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { ID, Query } from 'appwrite';

export interface Pedido {
  $id: string;
  $createdAt: string;
  clienteId: string;
  clienteNome: string;
  valorTotal: number;
  status: string;
  itens: string;
  endereco: string;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  constructor(private appwrite: AppwriteService) {}

  async criar(pedido: Partial<Pedido>): Promise<Pedido> {
    const doc = await this.appwrite.databases.createDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.pedidos,
      ID.unique(),
      { ...pedido, status: 'pendente' }
    );
    return doc as unknown as Pedido;
  }

  async listarAdmin(limit = 25, offset = 0, status?: string): Promise<{ documents: Pedido[], total: number }> {
    const queries: string[] = [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc('$createdAt')
    ];
    if (status) {
      queries.push(Query.equal('status', status));
    }

    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.pedidos,
      queries
    );
    return { documents: response.documents as unknown as Pedido[], total: response.total };
  }

  async listarPorCliente(clienteId: string): Promise<Pedido[]> {
    const response = await this.appwrite.databases.listDocuments(
      this.appwrite.databaseId,
      this.appwrite.collections.pedidos,
      [Query.equal('clienteId', clienteId), Query.orderDesc('$createdAt')]
    );
    return response.documents as unknown as Pedido[];
  }

  async getById(id: string): Promise<Pedido> {
    const doc = await this.appwrite.databases.getDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.pedidos,
      id
    );
    return doc as unknown as Pedido;
  }

  async atualizarStatus(id: string, status: string): Promise<Pedido> {
    const doc = await this.appwrite.databases.updateDocument(
      this.appwrite.databaseId,
      this.appwrite.collections.pedidos,
      id,
      { status }
    );
    return doc as unknown as Pedido;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      enviado: 'Enviado',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusChipColor(status: string): string {
    const colors: Record<string, string> = {
      pendente: 'gold',
      confirmado: 'green',
      enviado: 'dark',
      entregue: 'green',
      cancelado: 'red'
    };
    return colors[status] || 'gold';
  }
}
