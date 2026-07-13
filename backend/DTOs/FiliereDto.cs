using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class MentionDto
{
    public string Id { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Icone { get; set; } = string.Empty;
    public string Couleur { get; set; } = string.Empty;
    public string ResponsableNom { get; set; } = string.Empty;
    public string ResponsablePrenom { get; set; } = string.Empty;
    public int NbEtudiantsTotal { get; set; }
    public IEnumerable<ParcoursDto> Parcours { get; set; } = new List<ParcoursDto>();
}

public class ParcoursDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Niveau { get; set; } = string.Empty;
    public int NbEtudiants { get; set; }
    public bool OuvertConcours { get; set; }
    public bool Actif { get; set; }
    public string MentionId { get; set; } = string.Empty;
    public int? ResponsableEnseignantId { get; set; }
    public EnseignantDto? ResponsableEnseignant { get; set; }
}

public class CreateParcoursDto
{
    public string Code { get; set; } = string.Empty;
    [Required]
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Niveau { get; set; } = string.Empty;
    public int NbEtudiants { get; set; }
    public bool OuvertConcours { get; set; }
    public bool Actif { get; set; } = true;
    [Required]
    public string MentionId { get; set; } = string.Empty;
    public int? ResponsableEnseignantId { get; set; }
}

public class UpdateParcoursDto
{
    [Required]
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    [Required]
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Niveau { get; set; } = string.Empty;
    public int NbEtudiants { get; set; }
    public bool OuvertConcours { get; set; }
    public bool Actif { get; set; } = true;
    [Required]
    public string MentionId { get; set; } = string.Empty;
    public int? ResponsableEnseignantId { get; set; }
}
