import { Injectable } from '@angular/core';

export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private viaCepUrl = 'https://viacep.com.br/ws';

  async buscarCep(cep: string): Promise<Endereco | null> {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    try {
      const response = await fetch(`${this.viaCepUrl}/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) return null;
      return data as Endereco;
    } catch {
      return null;
    }
  }

  formatCep(cep: string): string {
    const clean = cep.replace(/\D/g, '');
    if (clean.length >= 5) {
      return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
    }
    return clean;
  }
}
