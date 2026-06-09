using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Infra;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutingController : ControllerBase {
  private AppDbContext db;

  public RoutingController(AppDbContext db){
    this.db = db;
  }

  [HttpGet]
  public async Task<IActionResult> GetAll(){
    var routings = await db.Routings.ToListAsync();
    return Ok(routings);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetById([FromRoute] Guid id){
    var routing = await db.Routings
      .Include(r => r.Slots)
      .FirstOrDefaultAsync(r => r.Id == id);
    if (routing == null)
      return NotFound(new { erro = "Roteirização não encontrada." });
    return Ok(routing);
  }

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateRoutingRequest req){
    if(string.IsNullOrWhiteSpace(req.Name)){
      return BadRequest("O nome da roteirização é obrigatório.");
    }

    var routing = new Routing {
      Name = req.Name
    };

    routing.Slots = req.Slots.Select(s => new Slot {
      ServicesQt = s.ServicesQt,
      Routing = routing
    }).ToList();


    db.Routings.Add(routing);
    await db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAll), new { id = routing.Id }, routing);
  }

}

public record CreateSlotRequest(int ServicesQt);
public record CreateRoutingRequest(string Name, List<CreateSlotRequest> Slots);

