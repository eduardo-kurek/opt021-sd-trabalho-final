using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Infra;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotController : ControllerBase {
  private AppDbContext db;

  public SlotController(AppDbContext db){
    this.db = db;
  }

  [HttpPost("take")]
  public async Task<IActionResult> TakeSlot([FromBody] TakeSlotRequest req){
    if(string.IsNullOrWhiteSpace(req.team)){
      return BadRequest("A equipe obrigatória.");
    }

    var slot = await db.Slots
      .Include(s => s.Routing).ThenInclude(routing => routing!.Slots)
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Slot não encontrado");
    }

    if(slot.Routing!.Slots.Any(s => s.Team == req.team)){
      return BadRequest("Essa equipe já está atribuida a uma vaga");
    }

    slot.Team = req.team;
    await db.SaveChangesAsync();
    return Ok();
  }

  [HttpPost("resign")]
  public async Task<IActionResult> TakeSlot([FromBody] ResignSlotRequest req){
    var slot = await db.Slots
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Slot não encontrado");
    }

    slot.Team = null;
    await db.SaveChangesAsync();
    return Ok();
  }


  [HttpPost("do-work")]
  public async Task<IActionResult> TakeSlot([FromBody] DoWorkRequest req){
    var slot = await db.Slots
      .FirstOrDefaultAsync(s => s.Id == req.slotId);

    if(slot == null){
      return BadRequest("Slot não encontrado");
    }

    if(slot.ServicesCompleted == slot.ServicesQt)
      return BadRequest("Todos os trabalhos já foram realizados");

    slot.ServicesCompleted++;
    await db.SaveChangesAsync();
    return Ok();
  }

}

public record TakeSlotRequest(Guid slotId, string team);
public record ResignSlotRequest(Guid slotId);
public record DoWorkRequest(Guid slotId);
