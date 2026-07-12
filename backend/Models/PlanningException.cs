namespace backend.Models;

public class PlanningException
{
    public int Id { get; set; }
    public int EnseignantId { get; set; }
    public int WeekNumber { get; set; }
    public string Reason { get; set; } = string.Empty;
}
