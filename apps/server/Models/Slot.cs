using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Server.Models;

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
