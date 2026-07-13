namespace backend.DTOs;

public class MatiereDto
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
    public string Type { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string Couleur { get; set; } = string.Empty;
    public int Coefficient { get; set; }
    public string Statut { get; set; } = string.Empty;
    public int VolumeCours { get; set; }
    public int VolumeTd { get; set; }
    public int VolumeTp { get; set; }
    public int VolumeProjet { get; set; }
    public int? ResponsableEnseignantId { get; set; }
}

public class CreateMatiereDto
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Mention { get; set; } = string.Empty;
    public string MentionId { get; set; } = string.Empty;
    public string Parcours { get; set; } = string.Empty;
    public string ParcoursNom { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public string Semestre { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string Couleur { get; set; } = string.Empty;
    public int Coefficient { get; set; }
    public string Statut { get; set; } = string.Empty;
    public int VolumeCours { get; set; }
    public int VolumeTd { get; set; }
    public int VolumeTp { get; set; }
    public int VolumeProjet { get; set; }
    public int? ResponsableEnseignantId { get; set; }
}
