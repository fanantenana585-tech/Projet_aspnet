using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class ExceptionService : IExceptionService
{
    private readonly IExceptionRepository _repository;

    public ExceptionService(IExceptionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExceptionDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(e => new ExceptionDto
        {
            Id = e.Id,
            EnseignantId = e.EnseignantId,
            WeekNumber = e.WeekNumber,
            Reason = e.Reason
        });
    }

    public async Task<ExceptionDto> CreateAsync(CreateExceptionDto dto)
    {
        var entity = new PlanningException
        {
            EnseignantId = dto.EnseignantId,
            WeekNumber = dto.WeekNumber,
            Reason = dto.Reason
        };
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return new ExceptionDto
        {
            Id = entity.Id,
            EnseignantId = entity.EnseignantId,
            WeekNumber = entity.WeekNumber,
            Reason = entity.Reason
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return false;
        _repository.Remove(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
