using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Mention
{
    [Key]
    public string Id { get; set; } = string.Empty; // ex: mention-info
    [Required]
    public string Nom { get; set; } = string.Empty;
    public string Icone { get; set; } = "🌐";
    public string Couleur { get; set; } = "#38BDF8";
    public string ResponsableNom { get; set; } = string.Empty;
    public string ResponsablePrenom { get; set; } = string.Empty;

    public List<Parcours> Parcours { get; set; } = new();
}
