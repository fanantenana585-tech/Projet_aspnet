namespace backend.DTOs;

public class SalleDto
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Capacite { get; set; }
    public string Batiment { get; set; } = string.Empty;
    public int Etage { get; set; }
    public List<string> Equipements { get; set; } = new List<string>();
    public string Statut { get; set; } = string.Empty;
    public int TauxOccupation { get; set; }
}

public class CreateSalleDto
{
    public string Nom { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Capacite { get; set; }
    public string Batiment { get; set; } = string.Empty;
    public int Etage { get; set; }
    public List<string> Equipements { get; set; } = new List<string>();
    public string Statut { get; set; } = string.Empty;
    public int TauxOccupation { get; set; }
}
