using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models;

/**
 * Entidade que representa uma vaga;
 * Possui um id, equipe, quantidade total de serviços,
 * quantidade de serviços completados e id do roteiro que está associada
 */
public class Slot {
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  public string? Team { get; set; }

  [Required]
  public int ServicesQt { get; set; }

  [Required]
  public int ServicesCompleted { get; set; }

  [Required]
  public Guid RoutingId { get; set; }

  [JsonIgnore]
  [ForeignKey("RoutingId")]
  public Routing? Routing { get; set; }
}
