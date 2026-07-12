using System;

namespace backend.Models;

public class EmploiDuTemps
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Salle { get; set; } = string.Empty;
    public string Enseignant { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Cours, TD, TP, Examen

    // New fields to match frontend needs
    public string? MentionId { get; set; }
    public string? ParcoursId { get; set; }
    public string? Niveau { get; set; }
    public string? Groupe { get; set; }
    public string? Jour { get; set; }
    public string? Note { get; set; }
}
