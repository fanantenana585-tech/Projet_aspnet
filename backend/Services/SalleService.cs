using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class SalleService : ISalleService
{
    private readonly ISalleRepository _repository;

    public SalleService(ISalleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SalleDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(e => MapToDto(e));
    }

    public async Task<SalleDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity != null ? MapToDto(entity) : null;
    }

    public async Task<SalleDto> CreateAsync(CreateSalleDto dto)
    {
        var entity = new Salle
        {
            Nom = dto.Nom,
            Type = dto.Type,
            Capacite = dto.Capacite,
            Batiment = dto.Batiment,
            Etage = dto.Etage,
            Equipements = dto.Equipements,
            Statut = dto.Statut,
            TauxOccupation = dto.TauxOccupation
        };
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<SalleDto?> UpdateAsync(int id, CreateSalleDto dto)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return null;

        entity.Nom = dto.Nom;
        entity.Type = dto.Type;
        entity.Capacite = dto.Capacite;
        entity.Batiment = dto.Batiment;
        entity.Etage = dto.Etage;
        entity.Equipements = dto.Equipements;
        entity.Statut = dto.Statut;
        entity.TauxOccupation = dto.TauxOccupation;

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

    private static SalleDto MapToDto(Salle e) => new SalleDto
    {
        Id = e.Id,
        Nom = e.Nom,
        Type = e.Type,
        Capacite = e.Capacite,
        Batiment = e.Batiment,
        Etage = e.Etage,
        Equipements = e.Equipements,
        Statut = e.Statut,
        TauxOccupation = e.TauxOccupation
    };
}
