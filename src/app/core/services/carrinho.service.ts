import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  produtoId: string;
  nome: string;
  preco: number;
  imagem: string;
  tamanho: string;
  cor: string;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private items = signal<CartItem[]>(this.loadFromStorage());

  cartItems = this.items.asReadonly();
  cartCount = computed(() => this.items().reduce((sum, item) => sum + item.quantidade, 0));
  subtotal = computed(() => this.items().reduce((sum, item) => sum + (item.preco * item.quantidade), 0));

  constructor() {
    // Auto-save to sessionStorage when cart changes
    effect(() => {
      sessionStorage.setItem('lucky021_cart', JSON.stringify(this.items()));
    });
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = sessionStorage.getItem('lucky021_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addItem(item: Omit<CartItem, 'quantidade'>, quantidade = 1): void {
    const current = this.items();
    const existing = current.findIndex(
      i => i.produtoId === item.produtoId && i.tamanho === item.tamanho && i.cor === item.cor
    );

    if (existing >= 0) {
      const updated = [...current];
      updated[existing] = { ...updated[existing], quantidade: updated[existing].quantidade + quantidade };
      this.items.set(updated);
    } else {
      this.items.set([...current, { ...item, quantidade }]);
    }
  }

  removeItem(index: number): void {
    this.items.set(this.items().filter((_, i) => i !== index));
  }

  updateQuantity(index: number, quantidade: number): void {
    if (quantidade <= 0) {
      this.removeItem(index);
      return;
    }
    const updated = [...this.items()];
    updated[index] = { ...updated[index], quantidade };
    this.items.set(updated);
  }

  clear(): void {
    this.items.set([]);
  }

  getShippingThreshold(): number {
    return 299;
  }

  freeShippingRemaining = computed(() => {
    const threshold = this.getShippingThreshold();
    const remaining = threshold - this.subtotal();
    return remaining > 0 ? remaining : 0;
  });

  hasFreeShipping = computed(() => this.subtotal() >= this.getShippingThreshold());
}
