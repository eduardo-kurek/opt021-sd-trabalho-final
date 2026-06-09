import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { Routing } from '../src/models/Routing';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5123/api/slot';

  takeSlot(slotId: string, team: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/take`, { slotId, team });
  }

  resignSlot(slotId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resign`, { slotId });
  }

  doWork(slotId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/do-work`, { slotId });
  }
}