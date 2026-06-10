import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Routing } from '../src/models/Routing';

@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private hubConnection!: signalR.HubConnection;
  
  public routingUpdate = signal<Routing | null>(null);
  public onlineTeams = signal<string[]>([]);

  public startConnection(routingId: string, team: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5123/hub/routing')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Escutando atualizações para o roteiro:', routingId);
        this.hubConnection.invoke('JoinRoutingGroup', routingId, team);
      })
      .catch(err => console.error('Erro ao conectar no SignalR:', err));

    this.hubConnection.on('ReceiveRoutingUpdate', (data: Routing) => {
      console.log('Roteiro atualizado:', data);
      this.routingUpdate.set(data);
    });

    this.hubConnection.on('UpdateOnlineTeams', (teams: string[]) => {
      console.log('Equipes atualizadas:', teams);
      this.onlineTeams.set(teams);
    });
  }

  public closeConnection(routingId: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveRoutingGroup', routingId);
      this.hubConnection.stop();
    }
  }
}