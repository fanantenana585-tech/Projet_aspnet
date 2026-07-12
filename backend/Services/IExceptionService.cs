using backend.DTOs;

namespace backend.Services;

public interface IExceptionService
{
    Task<IEnumerable<ExceptionDto>> GetAllAsync();
    Task<ExceptionDto> CreateAsync(CreateExceptionDto dto);
    Task<bool> DeleteAsync(int id);
}
