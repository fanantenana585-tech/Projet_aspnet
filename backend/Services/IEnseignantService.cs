using backend.DTOs;

namespace backend.Services;

public interface IEnseignantService
{
    Task<IEnumerable<EnseignantDto>> GetAllAsync();
    Task<EnseignantDto?> GetByIdAsync(int id);
    Task<EnseignantDto> CreateAsync(CreateEnseignantDto dto);
    Task<EnseignantDto?> UpdateAsync(int id, CreateEnseignantDto dto);
    Task<bool> DeleteAsync(int id);
}
