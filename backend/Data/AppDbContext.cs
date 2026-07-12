using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Enseignant> Enseignants { get; set; }
    public DbSet<Salle> Salles { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Matiere> Matieres { get; set; }
    public DbSet<Mention> Mentions { get; set; }
    public DbSet<Parcours> Parcours { get; set; }
    public DbSet<EmploiDuTemps> EmploiDuTemps { get; set; }
    public DbSet<PlanningException> PlanningExceptions { get; set; }
    public DbSet<UserSetting> UserSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Mapping to "Enseignants" with a capital E, which is the default for EF.
        builder.Entity<Enseignant>().ToTable("Enseignants");
        builder.Entity<Salle>().ToTable("Salles");
        builder.Entity<Matiere>().ToTable("Matieres");
        builder.Entity<Mention>().ToTable("Mentions");
        builder.Entity<Parcours>().ToTable("Parcours");
        builder.Entity<EmploiDuTemps>().ToTable("EmploiDuTemps");
        builder.Entity<Course>().ToTable("Courses");
    }
}
