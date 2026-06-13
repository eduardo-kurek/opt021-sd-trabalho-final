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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterModule, ButtonModule, CardModule, TagModule, ProgressBarModule, ToggleButtonModule, FormsModule],
  selector: 'app-routing-detail',
  templateUrl: './routing-detail.html',
  styleUrl: './routing-detail.css'
})
export class RoutingDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private routingId = signal<string | null>(null);
  public routing = signal<Routing | null>(null);
  private routingService = inject(RoutingService);
  private slotService = inject(SlotService);
  private messageService = inject(MessageService);
  private signalService = inject(SignalService);
  public onlineTeams = this.signalService.onlineTeams;
  currentUser = inject(CURRENT_USER);

  public isOnline = signal<boolean>(true);

  constructor() {
    effect(() => {
      const online = this.isOnline();
      const id = this.routingId();
      const user = this.currentUser();
      
      if (online && id) {
        this.signalService.startConnection(id, user);
        this.slotService.processOfflineQueue();
      } 
      else if (!online && id) {
        this.signalService.closeConnection(id);
      }
    });

    effect(() => {
      const routingUpdated = this.signalService.routingUpdate();
      if (routingUpdated) {
        this.routing.set(routingUpdated);
      }
    });
  }

  ngOnInit(): void {
    this.routingId.set(this.route.snapshot.paramMap.get('id') ?? null);
    if(this.routingId()) {
      this.routingService.getById(this.routingId()!).subscribe(routing => {
        this.routing.set(routing);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routingId()) {
      this.signalService.closeConnection(this.routingId()!);
    }
  }

  takeSlot(slotId: string) {
    this.slotService.takeSlot(slotId, this.currentUser(), this.isOnline()).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Vaga assumida com sucesso' });
    });
  }

  resignSlot(slotId: string) {
    this.slotService.resignSlot(slotId, this.isOnline()).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Vaga renunciada com sucesso' });
      this.routing.update(r => {
        if (!r) return r;
        const slot = r.slots.find(s => s.id === slotId);
        slot!.team = undefined;
        return r;
      });
    });
  }

  doWork(slotId: string) {
    this.slotService.doWork(slotId, this.isOnline()).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Trabalho realizado com sucesso' });
      this.routing.update(r => {
        const slot = r!.slots.find(s => s.id === slotId)!;
        if(slot.servicesCompleted < slot.servicesQt) {
          slot.servicesCompleted++;
          if(slot.servicesCompleted === slot.servicesQt) {
            slot.team = undefined;
          }
        }
        return r;
      })
    });
  }

}
