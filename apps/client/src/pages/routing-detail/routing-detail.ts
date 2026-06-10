import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { SignalService } from '../../../services/SignalService';
import { MessageService } from 'primeng/api';
import { CURRENT_USER } from '../../token/current-user.token';
import { FormField } from "@angular/forms/signals";

@Component({
  imports: [RouterModule, ButtonModule, CardModule, TagModule, ProgressBarModule],
  selector: 'app-routing-detail',
  templateUrl: './routing-detail.html',
  styleUrl: './routing-detail.css'
})
export class RoutingDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private routingId = '';
  public routing = signal<Routing | null>(null);
  private routingService = inject(RoutingService);
  private slotService = inject(SlotService);
  private messageService = inject(MessageService);
  private signalService = inject(SignalService);
  public onlineTeams = this.signalService.onlineTeams;
  currentUser = inject(CURRENT_USER);

  constructor() {
    effect(() => {
      const routingUpdated = this.signalService.routingUpdate();
      if (routingUpdated) {
        this.routing.set(routingUpdated);
      }
    });
  }

  ngOnInit(): void {
    this.routingId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.routingId) {
      this.routingService.getById(this.routingId).subscribe((data) => {
        this.routing.set(data);
      });

      this.signalService.startConnection(this.routingId, this.currentUser());
    }
  }

  ngOnDestroy(): void {
    if (this.routingId) {
      this.signalService.closeConnection(this.routingId);
    }
  }

  takeSlot(slotId: string) {
    this.slotService.takeSlot(slotId, this.currentUser()).subscribe(() => {
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
