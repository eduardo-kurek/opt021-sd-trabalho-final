using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Infra;

/**
 * Classe do ORM EfCore para acesso ao banco de dados
 */
public class AppDbContext : DbContext {
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {
  }

  public DbSet<Routing> Routings { get; set; }
  public DbSet<Slot> Slots { get; set; }
}
