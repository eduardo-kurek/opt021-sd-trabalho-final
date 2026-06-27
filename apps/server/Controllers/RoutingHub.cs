using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace Server.Controllers;

/**
 * Hub da biblioteca SignalR para clientes se conectarem e escutarem alterações automaticamente
 * Foi registrado na rota /hub/connection no arquivo Program.cs
 */
public class RoutingHub : Hub {

  /**
   * Dicionário para guardar os usuários conectados em cada roteiro
   */
  private static readonly ConcurrentDictionary<string, (string RoutingId, string Team)> UserConnections = new();

  /**
   * Método para o cliente se juntar à um grupo, recebe um id do roteiro que quer escutar e o nome da equipe
   */
  public async Task JoinRoutingGroup(string routingId, string team){
    await Groups.AddToGroupAsync(Context.ConnectionId, routingId);
    UserConnections[Context.ConnectionId] = (routingId, team);
    Console.WriteLine($"Cliente {Context.ConnectionId} entrou no grupo do roteiro: {routingId}");
    await BroadcastOnlineUsers(routingId);
  }

  /**
   * Método usado para o cliente se desconectar do grupo
   */
  public async Task LeaveRoutingGroup(string routingId){
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, routingId);
    UserConnections.TryRemove(Context.ConnectionId, out _);
    Console.WriteLine($"Cliente {Context.ConnectionId} saiu do grupo: {routingId}");
    await BroadcastOnlineUsers(routingId);
  }

  /**
   * Método chamado automaticamente pelo SignalR, é chamado quando a conexão se encerra.
   * O SignalR mantém um ping pong para identificar isso, e quando um cliente cai, chama esse método.
   * Remove o usuário da lista e avisa todos os outros que esse usuário caiu
   */
  public override async Task OnDisconnectedAsync(Exception? exception){
    if (UserConnections.TryRemove(Context.ConnectionId, out var connectionInfo)) {
      Console.WriteLine($"Conexão da equipe {connectionInfo.Team} desconectou.");
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, connectionInfo.RoutingId);
      await BroadcastOnlineUsers(connectionInfo.RoutingId);
    }

    await base.OnDisconnectedAsync(exception);
  }

  /**
   * Avisa todos os usuários do roteiro quais são os outros usuários conectados
   */
  private async Task BroadcastOnlineUsers(string routingId){
    var onlineTeams = UserConnections.Values
      .Where(x => x.RoutingId == routingId)
      .Select(x => x.Team)
      .Distinct()
      .ToList();

    await Clients.Group(routingId).SendAsync("UpdateOnlineTeams", onlineTeams);
  }
}
