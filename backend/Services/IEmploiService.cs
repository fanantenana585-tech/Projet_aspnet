using backend.DTOs;

namespace backend.Services;

public interface IEmploiService
{
    Task<IEnumerable<EmploiDto>> GetAllAsync();
    Task<EmploiDto?> GetByIdAsync(int id);
    Task<EmploiDto> CreateAsync(CreateEmploiDto dto);
    Task<EmploiDto?> UpdateAsync(int id, CreateEmploiDto dto);
    Task<bool> DeleteAsync(int id);
}
