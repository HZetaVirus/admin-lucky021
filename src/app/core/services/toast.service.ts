import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  messages = signal<ToastMessage[]>([]);

  show(text: string, type: ToastMessage['type'] = 'success'): void {
    const icons: Record<string, string> = {
      success: '🂡',
      error: '🃏',
      warning: '🎲',
      info: '♠'
    };

    const toast: ToastMessage = {
      id: ++this.counter,
      text,
      type,
      icon: icons[type]
    };

    this.messages.set([...this.messages(), toast]);

    setTimeout(() => {
      this.dismiss(toast.id);
    }, 4000);
  }

  dismiss(id: number): void {
    this.messages.set(this.messages().filter(m => m.id !== id));
  }

  // Casino-themed convenience methods
  sucesso(msg: string): void { this.show(msg, 'success'); }
  erro(msg: string): void { this.show(msg, 'error'); }
  aviso(msg: string): void { this.show(msg, 'warning'); }
}
