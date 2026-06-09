import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Routing } from '../../models/Routing';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from "primeng/tag";
import { ProgressBarModule } from 'primeng/progressbar';
import { RoutingService } from '../../../services/RoutingService';
import { SlotService } from '../../../services/SlotService';
import { MessageService } from 'primeng/api';

@Component({
  imports: [RouterModule, ButtonModule, CardModule, TagModule, ProgressBarModule],
  selector: 'app-routing-detail',
  templateUrl: './routing-detail.html',
  styleUrl: './routing-detail.css'
})
export class RoutingDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  public routing = signal<Routing | null>(null);
  private routingService = inject(RoutingService);
  private slotService = inject(SlotService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.routingService.getById(id).subscribe((data) => {
        this.routing.set(data);
      });
    }
  }

  takeSlot(slotId: string, team: string) {
    this.slotService.takeSlot(slotId, team).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Vaga assumida com sucesso' });
    });
  }

  resignSlot(slotId: string) {
    this.slotService.resignSlot(slotId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Vaga renunciada com sucesso' });
    });
  }

  doWork(slotId: string) {
    this.slotService.doWork(slotId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Trabalho realizado com sucesso' });
    });
  }

}
