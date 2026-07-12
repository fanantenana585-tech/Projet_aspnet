using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EmploiService : IEmploiService
{
    private readonly IEmploiRepository _repository;

    public EmploiService(IEmploiRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmploiDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(e => MapToDto(e));
    }

    public async Task<EmploiDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity != null ? MapToDto(entity) : null;
    }

    public async Task<EmploiDto> CreateAsync(CreateEmploiDto dto)
    {
        var entity = new EmploiDuTemps
        {
            Title = dto.Title,
            Description = dto.Description,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Salle = dto.Salle,
            Enseignant = dto.Enseignant,
            Type = dto.Type,
            MentionId = dto.MentionId,
            ParcoursId = dto.ParcoursId,
            Niveau = dto.Niveau,
            Groupe = dto.Groupe,
            Jour = dto.Jour,
            Note = dto.Note
        };
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<EmploiDto?> UpdateAsync(int id, CreateEmploiDto dto)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return null;

        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.StartTime = dto.StartTime;
        entity.EndTime = dto.EndTime;
        entity.Salle = dto.Salle;
        entity.Enseignant = dto.Enseignant;
        entity.Type = dto.Type;
        entity.MentionId = dto.MentionId;
        entity.ParcoursId = dto.ParcoursId;
        entity.Niveau = dto.Niveau;
        entity.Groupe = dto.Groupe;
        entity.Jour = dto.Jour;
        entity.Note = dto.Note;

        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return false;

        _repository.Remove(entity);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static EmploiDto MapToDto(EmploiDuTemps e) => new EmploiDto
    {
        Id = e.Id,
        Title = e.Title,
        Description = e.Description,
        StartTime = e.StartTime,
        EndTime = e.EndTime,
        Salle = e.Salle,
        Enseignant = e.Enseignant,
        Type = e.Type,
        MentionId = e.MentionId,
        ParcoursId = e.ParcoursId,
        Niveau = e.Niveau,
        Groupe = e.Groupe,
        Jour = e.Jour,
        Note = e.Note
    };
}
