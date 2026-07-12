using backend.DTOs;

namespace backend.Services;

public interface IFiliereService
{
    Task<IEnumerable<MentionDto>> GetFullStructureAsync();
    Task<ParcoursDto> CreateParcoursAsync(CreateParcoursDto dto);
    Task<bool> DeleteParcoursAsync(int id);
}
