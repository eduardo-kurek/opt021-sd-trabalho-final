using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Routing {
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public string Name { get; set; } = string.Empty;
}
