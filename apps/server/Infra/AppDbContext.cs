using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Infra;

public class AppDbContext : DbContext {
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {
  }

  public DbSet<Routing> Routings { get; set; }
  public DbSet<Slot> Slots { get; set; }
}
