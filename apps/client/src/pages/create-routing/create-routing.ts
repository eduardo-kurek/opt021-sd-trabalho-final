import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import {form, FormField, FormRoot} from '@angular/forms/signals';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RoutingService } from '../../../services/RoutingService';

interface SlotForm {
  servicesQt: number;
}

interface RoutingForm {
  name: string;
  slots: SlotForm[];
}



@Component({
  imports: [ButtonModule, PanelModule, InputTextModule, FloatLabelModule, FormField, FormRoot, InputNumberModule],
  selector: 'create-routing',
  templateUrl: './create-routing.html',
})
export class CreateRouting {
  private service = inject(RoutingService);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private router = inject(Router);

  routingModel = signal<RoutingForm>({
    name: '',
    slots: []
  })

  routingForm = form(this.routingModel, (sc) => {}, {
    submission: {
      action: async (field) => {
        console.log('submetendo form', field().value());
        this.service.create(field().value().name, field().value().slots)
          .subscribe((result) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Roteiro criado com sucesso!' });
            this.router.navigate(['/']);
          });
      } 
    }
  })

  addSlot() {
    this.routingModel.update((model) => ({
      ...model,
      slots: [...model.slots, { servicesQt: 0 }]
    }));
  }
}
