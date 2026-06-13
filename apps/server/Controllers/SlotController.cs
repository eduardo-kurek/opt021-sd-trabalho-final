using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Server.Infra;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotController : ControllerBase {
  private AppDbContext db;
  private readonly IHubContext<RoutingHub> hubContext;

  public SlotController(AppDbContext db, IHubContext<RoutingHub> hubContext){
    this.db = db;
    this.hubContext = hubContext;
  }

  [HttpPost("take")]
  public async Task<IActionResult> TakeSlot([FromBody] TakeSlotRequest req){
    if(string.IsNullOrWhiteSpace(req.team)){
      return BadRequest("A equipe é obrigatória");
    }

    var slot = await db.Slots
      .Include(s => s.Routing).ThenInclude(routing => routing!.Slots.OrderBy((s => s.Id)))
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Vaga não encontrado");
    }

    var oldSlot = slot.Routing!.Slots
      .FirstOrDefault(s => s.Team == req.team && s.Id != req.slotId);

    oldSlot?.Team = null;
    slot.Team = req.team;
    await db.SaveChangesAsync();
    await NotifyGroup(slot.RoutingId);
    return Ok();
  }

  [HttpPost("resign")]
  public async Task<IActionResult> ResignSlot([FromBody] ResignSlotRequest req){
    var slot = await db.Slots
      .Include(s => s.Routing)
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Vaga não encontrado");
    }

    slot.Team = null;
    await db.SaveChangesAsync();
    await NotifyGroup(slot.RoutingId);
    return Ok();
  }


  [HttpPost("do-work")]
  public async Task<IActionResult> DoWork([FromBody] DoWorkRequest req){
    var slot = await db.Slots
      .Include(s => s.Routing)
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Slot não encontrado");
    }

    if(slot.ServicesCompleted == slot.ServicesQt)
      return BadRequest("Todos os trabalhos já foram realizados");

    slot.ServicesCompleted++;

    if(slot.ServicesCompleted == slot.ServicesQt){
      slot.Team = null;
    }
    await db.SaveChangesAsync();
    await NotifyGroup(slot.RoutingId);
    return Ok();
  }

  private async Task NotifyGroup(Guid routingId){
    var routing = await db.Routings
      .Include(r => r.Slots)
      .Select(r => new Routing {
        Id = r.Id,
        Name = r.Name,
        Slots = r.Slots.OrderBy(s => s.Id).ToList()
      })
      .FirstOrDefaultAsync(r => r.Id == routingId);

    if (routing != null){
      await hubContext.Clients
        .Group(routingId.ToString())
        .SendAsync("ReceiveRoutingUpdate", routing);
    }
  }

}

public record TakeSlotRequest(Guid slotId, string team);
public record ResignSlotRequest(Guid slotId);
public record DoWorkRequest(Guid slotId);
