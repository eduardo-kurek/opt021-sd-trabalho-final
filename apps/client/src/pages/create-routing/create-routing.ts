import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import {form, FormField, FormRoot} from '@angular/forms/signals';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

interface RoutingForm {
  name: string;
}

@Component({
  imports: [ButtonModule, PanelModule, InputTextModule, FloatLabelModule, FormField, FormRoot],
  selector: 'create-routing',
  templateUrl: './create-routing.html',
})
export class CreateRouting {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private router = inject(Router);

  routingModel = signal<RoutingForm>({
    name: '',
  })

  routingForm = form(this.routingModel, (sc) => {}, {
    submission: {
      action: async (field) => {
        this.http.post('http://localhost:5123/api/routing', field().value())
          .subscribe((result) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Roteiro criado com sucesso!' });
            this.router.navigate(['/']);
          });
      } 
    }
  })
}
