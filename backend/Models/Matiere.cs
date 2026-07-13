using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Matiere
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Mention { get; set; } = string.Empty;
    public string MentionId { get; set; } = string.Empty;
    public string Parcours { get; set; } = string.Empty;
    public string ParcoursNom { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Simplified from List<string>
    public int Credits { get; set; }
    public string Couleur { get; set; } = string.Empty;
    public int Coefficient { get; set; }
    public string Statut { get; set; } = string.Empty;
    
    // Simplification for volume horaire as a JSON string or ignored
    public int VolumeCours { get; set; }
    public int VolumeTd { get; set; }
    public int VolumeTp { get; set; }
    public int VolumeProjet { get; set; }
    public int? ResponsableEnseignantId { get; set; }
}
