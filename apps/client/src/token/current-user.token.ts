import { InjectionToken, signal, WritableSignal } from '@angular/core';

export const CURRENT_USER = new InjectionToken<WritableSignal<string>>('CURRENT_USER', {
  providedIn: 'root',
  factory: () => signal('edu') 
});