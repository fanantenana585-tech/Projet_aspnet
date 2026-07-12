using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Parcours
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Code { get; set; } = string.Empty; // ex: DA2I

    [Required]
    public string Nom { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public string Niveau { get; set; } = "Licence"; // Licence ou Master
    public int NbEtudiants { get; set; }
    public bool OuvertConcours { get; set; }
    public bool Actif { get; set; } = true;

    [Required]
    public string MentionId { get; set; } = string.Empty;

    [ForeignKey("MentionId")]
    public Mention? Mention { get; set; }

    public int? ResponsableEnseignantId { get; set; }

    [ForeignKey("ResponsableEnseignantId")]
    public Enseignant? ResponsableEnseignant { get; set; }
}
