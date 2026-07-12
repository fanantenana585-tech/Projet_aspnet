namespace backend.Models;

public class Course
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Departement { get; set; } = string.Empty;
    public int Promotion { get; set; }
    public int ProfesseurId { get; set; }
    public string Salle { get; set; } = string.Empty;
    public string Jour { get; set; } = string.Empty;
    public string Creneau { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
