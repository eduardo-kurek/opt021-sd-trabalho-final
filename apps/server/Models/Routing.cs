using System.ComponentModel.DataAnnotations;

namespace Server.Models;

/**
 * Entidade que representa um roteiro,
 * possui id, nome e uma lista de vagas
 */
public class Routing {
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public string Name { get; set; } = string.Empty;

  public List<Slot> Slots { get; set; } = [];
}
