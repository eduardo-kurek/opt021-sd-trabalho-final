import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { Routing } from '../src/models/Routing';

/**
 * Serviço para conexão na api de roteiros
 */
@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5123/api/routing';

  /**
   * Obtém um roteiro através do id
   */
  getById(id: string): Observable<Routing> {
    return this.http.get<Routing>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtém todos os roteiros cadastrados
   */
  getAll(): Observable<Routing[]> {
    return this.http.get<Routing[]>(this.apiUrl);
  }

  /**
   * Cria um novo roteiro
   */
  create(name: string, slots: any[]): Observable<any> {
    return this.http.post('http://localhost:5123/api/routing', { name, slots });
  }
}