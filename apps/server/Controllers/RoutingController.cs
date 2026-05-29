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

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateRoutingRequest req){
    if(string.IsNullOrWhiteSpace(req.Name)){
      return BadRequest("O nome da roteirização é obrigatório.");
    }

    var routing = new Routing {
      Name = req.Name
    };

    db.Routings.Add(routing);
    await db.SaveChangesAsync();

    return CreatedAtAction(nameof(GetAll), new { id = routing.Id }, routing);
  }

}

public record CreateRoutingRequest(string Name);
