using backend.DTOs;

namespace backend.Services;

public interface IFiliereService
{
    Task<IEnumerable<MentionDto>> GetFullStructureAsync();
    Task<ParcoursDto> GetParcoursAsync(int id);
    Task<ParcoursDto> CreateParcoursAsync(CreateParcoursDto dto);
    Task<ParcoursDto> UpdateParcoursAsync(UpdateParcoursDto dto);
    Task<bool> DeleteParcoursAsync(int id);
}
