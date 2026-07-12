using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Roles
        string[] roleNames = { "Admin", "User" };
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // 2. Admin User
        var adminEmail = "admin@emit.mg";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "EMIT",
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(adminUser, "password123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // 3. Initial Matieres
        if (!await context.Matieres.AnyAsync())
        {
            var matieres = new List<Matiere>
            {
                new Matiere {
                    Code = "DA2I101", Nom = "Programmation Web Front-End",
                    Description = "HTML5, CSS3, JavaScript ES6+ et frameworks modernes Vue.js/React.",
                    Mention = "Informatique", MentionId = "mention-info",
                    Parcours = "DA2I", ParcoursNom = "Développement d'Application Internet/Intranet",
                    Niveau = "L1", Semestre = "S1", Type = "Cours, TP",
                    Credits = 4, Coefficient = 3, Statut = "actif", Couleur = "#0EA5E9",
                    VolumeCours = 20, VolumeTp = 20
                },
                new Matiere {
                    Code = "DA2I201", Nom = "Développement Back-End Node.js",
                    Description = "APIs REST, Express.js, authentification JWT et bases de données NoSQL.",
                    Mention = "Informatique", MentionId = "mention-info",
                    Parcours = "DA2I", ParcoursNom = "Développement d'Application Internet/Intranet",
                    Niveau = "L2", Semestre = "S3", Type = "Cours, TD, TP",
                    Credits = 5, Coefficient = 3, Statut = "actif", Couleur = "#0EA5E9",
                    VolumeCours = 22, VolumeTd = 8, VolumeTp = 16
                },
                new Matiere {
                    Code = "AES101", Nom = "Introduction à l'Économie",
                    Description = "Microéconomie, macroéconomie, marchés et politiques économiques.",
                    Mention = "Management", MentionId = "mention-mgt",
                    Parcours = "AES", ParcoursNom = "Administration Économique et Sociale",
                    Niveau = "L1", Semestre = "S1", Type = "Cours, TD",
                    Credits = 4, Coefficient = 3, Statut = "actif", Couleur = "#10B981",
                    VolumeCours = 24, VolumeTd = 12
                }
            };
            context.Matieres.AddRange(matieres);
            await context.SaveChangesAsync();
        }

        // 4. Initial Enseignants
        if (!await context.Enseignants.AnyAsync())
        {
            context.Enseignants.AddRange(new List<Enseignant>
            {
                new Enseignant { Nom = "Rakoto", Prenom = "Jean", Email = "j.rakoto@emit.mg", Specialite = "Informatique", Statut = "actif", Initiales = "JR" },
                new Enseignant { Nom = "Rasoa", Prenom = "Marie", Email = "m.rasoa@emit.mg", Specialite = "Management", Statut = "actif", Initiales = "MR" }
            });
            await context.SaveChangesAsync();
        }

        // 5. Initial Salles
        if (!await context.Salles.AnyAsync())
        {
            context.Salles.AddRange(new List<Salle>
            {
                new Salle { Nom = "Salle 1", Type = "Cours", Capacite = 50, Batiment = "Principal", Etage = 1, Statut = "disponible", TauxOccupation = 0 },
                new Salle { Nom = "Salle 2", Type = "TP", Capacite = 20, Batiment = "Principal", Etage = 1, Statut = "disponible", TauxOccupation = 0 },
                new Salle { Nom = "Amphi A", Type = "Amphithéâtre", Capacite = 200, Batiment = "Annexe", Etage = 0, Statut = "disponible", TauxOccupation = 0 }
            });
            await context.SaveChangesAsync();
        }

        // 6. Mentions and Parcours
        if (!await context.Mentions.AnyAsync())
        {
            var mentions = new List<Mention>
            {
                new Mention {
                    Id = "mention-info", Nom = "Informatique", Icone = "💻", Couleur = "#38BDF8",
                    ResponsableNom = "Rakoto", ResponsablePrenom = "Jean"
                },
                new Mention {
                    Id = "mention-mgmt", Nom = "Management", Icone = "📊", Couleur = "#059669",
                    ResponsableNom = "Rasoa", ResponsablePrenom = "Marie"
                },
                new Mention {
                    Id = "mention-rpm", Nom = "Relations Publiques", Icone = "📢", Couleur = "#EC4899",
                    ResponsableNom = "Andry", ResponsablePrenom = "Paul"
                }
            };
            context.Mentions.AddRange(mentions);
            await context.SaveChangesAsync();

            var parcours = new List<Parcours>
            {
                new Parcours { Code = "DA2I", Nom = "Développement d'Application Internet/Intranet", Niveau = "Licence", MentionId = "mention-info", NbEtudiants = 120 },
                new Parcours { Code = "SIGD", Nom = "Systèmes d'Information et Géo-Décision", Niveau = "Master", MentionId = "mention-info", NbEtudiants = 45 },
                new Parcours { Code = "AES", Nom = "Administration Économique et Sociale", Niveau = "Licence", MentionId = "mention-mgmt", NbEtudiants = 200 }
            };
            context.Parcours.AddRange(parcours);
            await context.SaveChangesAsync();
        }

        // 7. Initial EmploiDuTemps
        if (!await context.EmploiDuTemps.AnyAsync())
        {
            context.EmploiDuTemps.Add(new EmploiDuTemps
            {
                Title = "INFO101 Programmation Web",
                Description = "Cours magistral",
                StartTime = new DateTime(2026, 6, 15, 8, 0, 0, DateTimeKind.Utc),
                EndTime = new DateTime(2026, 6, 15, 10, 0, 0, DateTimeKind.Utc),
                Salle = "Salle 1",
                Enseignant = "Rakoto Jean",
                Type = "Cours",
                MentionId = "mention-info",
                ParcoursId = "DA2I",
                Niveau = "L1",
                Jour = "Lundi"
            });
            await context.SaveChangesAsync();
        }

        // 8. Initial Courses
        if (!await context.Courses.AnyAsync())
        {
            context.Courses.Add(new Course
            {
                Nom = "Algorithmique",
                Departement = "Informatique",
                Promotion = 2025,
                ProfesseurId = 1,
                Salle = "Salle 1",
                Jour = "Lundi",
                Creneau = "08:00 - 10:00"
            });
            await context.SaveChangesAsync();
        }

        // 9. Initial Settings
        if (!await context.UserSettings.AnyAsync())
        {
            var profil = new {
                nom = "BOTSOKAYA",
                prenom = "Admin",
                email = "admin@emit.mg",
                role = "Administrateur",
                bio = "Responsable de la gestion des emplois du temps à l'EMIT.",
                telephone = "+261 34 00 000 00",
                poste = "Chef de Département",
                departement = "Informatique"
            };
            context.UserSettings.Add(new UserSetting { Key = "profil", Value = JsonSerializer.Serialize(profil) });

            var preferences = new {
                langue = "Français",
                timezone = "Indian/Antananarivo",
                formatDate = "DD/MM/YYYY",
                formatHeure = "24h",
                formatSemaine = "Lundi"
            };
            context.UserSettings.Add(new UserSetting { Key = "preferences", Value = JsonSerializer.Serialize(preferences) });

            await context.SaveChangesAsync();
        }
    }
}
