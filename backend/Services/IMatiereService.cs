using backend.DTOs;

namespace backend.Services;

public interface IMatiereService
{
    Task<IEnumerable<MatiereDto>> GetAllAsync();
    Task<MatiereDto?> GetByIdAsync(int id);
    Task<MatiereDto> CreateAsync(CreateMatiereDto dto);
    Task<MatiereDto?> UpdateAsync(int id, CreateMatiereDto dto);
    Task<bool> DeleteAsync(int id);
}
