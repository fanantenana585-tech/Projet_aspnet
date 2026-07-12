using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class UserSetting
{
    [Key]
    public string Key { get; set; } = string.Empty; // e.g., "profil", "preferences", "notifications", "systeme"
    public string Value { get; set; } = string.Empty; // JSON string
    public string? UserId { get; set; }
}
