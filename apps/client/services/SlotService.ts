import { effect, inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { Routing } from '../src/models/Routing';

interface OfflineAction {
  type: 'resign' | 'do-work';
  slotId: string;
}


@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5123/api/slot';
  private offlineQueue = signal<OfflineAction[]>([]);
  private isOnline = signal<boolean>(true);

  takeSlot(slotId: string, team: string, online: boolean): Observable<void> {
    if(!online) {
      throw new Error('Não é possível tomar um slot enquanto estiver offline.');
    }
    return this.http.post<void>(`${this.apiUrl}/take`, { slotId, team });
  }

  resignSlot(slotId: string, online: boolean): Observable<void> {
    if(!online) {
      this.saveToOfflineQueue('resign', slotId);
      return of(undefined);
    }
    return this.http.post<void>(`${this.apiUrl}/resign`, { slotId });
  }

  doWork(slotId: string, online: boolean): Observable<void> {
    if(!online) {
      this.saveToOfflineQueue('do-work', slotId);
      return of(undefined);
    }
    return this.http.post<void>(`${this.apiUrl}/do-work`, { slotId });
  }

  private saveToOfflineQueue(type: 'resign' | 'do-work', slotId: string) {
    const currentQueue = this.offlineQueue();
    this.offlineQueue.set([...currentQueue, { type, slotId }]);
  }

  public async processOfflineQueue() {
    if(this.offlineQueue().length == 0) return;

    const queue = [...this.offlineQueue()];
    this.offlineQueue.set([]); // Limpa a fila

    for (const action of queue) {
      try {
        if (action.type === 'resign') {
          await firstValueFrom(this.http.post(`${this.apiUrl}/resign`, { slotId: action.slotId }));
          console.log(`Slot ${action.slotId} resignado com sucesso.`);
        } else if (action.type === 'do-work') {
          await firstValueFrom(this.http.post(`${this.apiUrl}/do-work`, { slotId: action.slotId }));
          console.log(`Slot ${action.slotId} atualizado com sucesso.`);
        }
      } catch (error) {
        console.error(`Falha ao sincronizar slot ${action.slotId}:`, error);
      }
    }
  }
}