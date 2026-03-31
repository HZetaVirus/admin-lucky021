import { Injectable, NgZone } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { Subject } from 'rxjs';

export interface RealtimeEvent {
  collection: string;
  action: 'create' | 'update' | 'delete';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private events$ = new Subject<RealtimeEvent>();
  private unsubscribe: (() => void) | null = null;

  changes$ = this.events$.asObservable();

  constructor(
    private appwrite: AppwriteService,
    private zone: NgZone
  ) {}

  connect(): void {
    if (this.unsubscribe) return;

    const channel = `databases.${this.appwrite.databaseId}.collections.*.documents`;

    this.unsubscribe = this.appwrite.getClient().subscribe(channel, (response) => {
      this.zone.run(() => {
        const parts = response.events[0].split('.');
        const collectionId = parts[3];
        let action: RealtimeEvent['action'] = 'update';
        const eventStr = response.events[0];
        if (eventStr.includes('.create')) action = 'create';
        else if (eventStr.includes('.delete')) action = 'delete';
        else if (eventStr.includes('.update')) action = 'update';

        this.events$.next({
          collection: collectionId,
          action,
          payload: response.payload
        });
      });
    });
  }

  disconnect(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
