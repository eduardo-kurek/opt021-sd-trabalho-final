using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutingController : ControllerBase {

  [HttpGet]
  public IActionResult GetAll(){
    var response = new {
      Message = "Teste"
    };
    return Ok(response);
  }

}
