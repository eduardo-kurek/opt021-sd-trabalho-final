import { effect, inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { Routing } from '../src/models/Routing';

/**
 * Objeto que é guardado na fila de atividades offlines
 * Pode ser do tipo resign ou do-work.
 */
interface OfflineAction {
  type: 'resign' | 'do-work';
  slotId: string;
}

/**
 * Classe que gerencia as vagas
 */
@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5123/api/slot';
  private offlineQueue = signal<OfflineAction[]>([]); // Guarda uma lista de ações offlines, quando sem conexão
  private isOnline = signal<boolean>(true);

  /**
   * Associa uma equipe à uma vaga, porém se estiver offline dispara um erro (ação inválida)
   */
  takeSlot(slotId: string, team: string, online: boolean): Observable<void> {
    if(!online) {
      throw new Error('Não é possível tomar um slot enquanto estiver offline.');
    }
    return this.http.post<void>(`${this.apiUrl}/take`, { slotId, team });
  }

  /**
   * Desassocia uma equipe de uma vaga, porém se estiver offline, apenas adiciona na lista de tarefas
   */
  resignSlot(slotId: string, online: boolean): Observable<void> {
    if(!online) {
      this.saveToOfflineQueue('resign', slotId);
      return of(undefined);
    }
    return this.http.post<void>(`${this.apiUrl}/resign`, { slotId });
  }

  /**
   * Realiza um trabalho de uma vaga, porém se estiver offline, apenas adiciona na lista de tarefas
   */
  doWork(slotId: string, online: boolean): Observable<void> {
    if(!online) {
      this.saveToOfflineQueue('do-work', slotId);
      return of(undefined);
    }
    return this.http.post<void>(`${this.apiUrl}/do-work`, { slotId });
  }
  
  /**
   * Adiciona uma tarefa na fila de offlines
   */
  private saveToOfflineQueue(type: 'resign' | 'do-work', slotId: string) {
    const currentQueue = this.offlineQueue();
    this.offlineQueue.set([...currentQueue, { type, slotId }]);
  }

  /**
   * Executa todas as ações pendentes na fila de tarefas, na mesma ordem em que foram inseridas
   */
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