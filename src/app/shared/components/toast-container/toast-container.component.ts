import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.messages(); track toast.id) {
        <div class="toast" [class]="toast.type" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon">{{ toast.icon }}</span>
          <span class="toast-text">{{ toast.text }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-icon {
      font-size: 1.2rem;
    }
    .toast-text {
      flex: 1;
    }
    .toast {
      cursor: pointer;
    }
    .toast:hover {
      opacity: 0.8;
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
