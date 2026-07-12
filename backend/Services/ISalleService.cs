using backend.DTOs;

namespace backend.Services;

public interface ISalleService
{
    Task<IEnumerable<SalleDto>> GetAllAsync();
    Task<SalleDto?> GetByIdAsync(int id);
    Task<SalleDto> CreateAsync(CreateSalleDto dto);
    Task<SalleDto?> UpdateAsync(int id, CreateSalleDto dto);
    Task<bool> DeleteAsync(int id);
}
