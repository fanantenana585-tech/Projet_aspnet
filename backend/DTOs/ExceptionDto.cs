namespace backend.DTOs;

public class ExceptionDto
{
    public int Id { get; set; }
    public int EnseignantId { get; set; }
    public int WeekNumber { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class CreateExceptionDto
{
    public int EnseignantId { get; set; }
    public int WeekNumber { get; set; }
    public string Reason { get; set; } = string.Empty;
}
