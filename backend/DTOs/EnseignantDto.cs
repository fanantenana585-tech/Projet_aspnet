using System.Text.Json.Serialization;

namespace backend.DTOs;

public class EnseignantDto
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Specialite { get; set; } = string.Empty;
    public string Statut { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("telephone")]
    public string? Telephone { get; set; }
    public string? Initiales { get; set; }
}

public class CreateEnseignantDto
{
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Specialite { get; set; } = string.Empty;
    public string Statut { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("telephone")]
    public string? Telephone { get; set; }
    public string? Initiales { get; set; }
}
