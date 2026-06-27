import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Routing } from '../src/models/Routing';

/**
 * Classe responsável por tratar as conexões no hub do SignalR do backend
 */
@Injectable({
  providedIn: 'root'
})
export class SignalService {
  private hubConnection!: signalR.HubConnection;
  
  public routingUpdate = signal<Routing | null>(null); // Recebe atualizações do roteiro
  public onlineTeams = signal<string[]>([]); // Guarda os times conectados no roteiro

  /**
   * Se conecta no grupo de um roteiro 
   */
  public startConnection(routingId: string, team: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5123/hub/routing')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Escutando atualizações para o roteiro:', routingId);
        this.hubConnection.invoke('JoinRoutingGroup', routingId, team); // Envia mensagem para o hub dizendo que quer se conectar
      })
      .catch(err => console.error('Erro ao conectar no SignalR:', err));

    // Quando receber a mensagem ReceiveRoutingUpdate, atualiza o objeto
    this.hubConnection.on('ReceiveRoutingUpdate', (data: Routing) => {
      console.log('Roteiro atualizado:', data);
      this.routingUpdate.set(data);
    });

    // Quando receber a mensagem UpdateOnlineTeams, atualiza as equipes onlines
    this.hubConnection.on('UpdateOnlineTeams', (teams: string[]) => {
      console.log('Equipes atualizadas:', teams);
      this.onlineTeams.set(teams);
    });
  }

  /**
   * Finaliza a conexão com o hub
   */
  public closeConnection(routingId: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveRoutingGroup', routingId);
      this.hubConnection.stop();
    }
  }
}