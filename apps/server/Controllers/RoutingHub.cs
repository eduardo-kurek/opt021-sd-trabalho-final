using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace Server.Controllers;

public class RoutingHub : Hub {
  private static readonly ConcurrentDictionary<string, (string RoutingId, string Team)> UserConnections = new();

  public async Task JoinRoutingGroup(string routingId, string team){
    await Groups.AddToGroupAsync(Context.ConnectionId, routingId);
    UserConnections[Context.ConnectionId] = (routingId, team);
    Console.WriteLine($"Cliente {Context.ConnectionId} entrou no grupo do roteiro: {routingId}");
    await BroadcastOnlineUsers(routingId);
  }

  public async Task LeaveRoutingGroup(string routingId){
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, routingId);
    UserConnections.TryRemove(Context.ConnectionId, out _);
    Console.WriteLine($"Cliente {Context.ConnectionId} saiu do grupo: {routingId}");
    await BroadcastOnlineUsers(routingId);
  }

  public override async Task OnDisconnectedAsync(Exception? exception){
    if (UserConnections.TryRemove(Context.ConnectionId, out var connectionInfo)) {
      Console.WriteLine($"Conexão da equipe {connectionInfo.Team} desconectou.");
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, connectionInfo.RoutingId);
      await BroadcastOnlineUsers(connectionInfo.RoutingId);
    }

    await base.OnDisconnectedAsync(exception);
  }

  private async Task BroadcastOnlineUsers(string routingId){
    var onlineTeams = UserConnections.Values
      .Where(x => x.RoutingId == routingId)
      .Select(x => x.Team)
      .Distinct()
      .ToList();

    await Clients.Group(routingId).SendAsync("UpdateOnlineTeams", onlineTeams);
  }
}
