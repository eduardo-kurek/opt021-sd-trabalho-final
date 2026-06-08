import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { Routing } from '../src/models/Routing';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5123/api/routing';

  getById(id: string): Observable<Routing> {
    return this.http.get<Routing>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Routing[]> {
    return this.http.get<Routing[]>(this.apiUrl);
  }

  create(name: string, slots: any[]): Observable<any> {
    return this.http.post('http://localhost:5123/api/routing', { name, slots });
  }
}