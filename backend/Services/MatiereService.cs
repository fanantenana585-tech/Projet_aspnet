using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class MatiereService : IMatiereService
{
    private readonly IMatiereRepository _repository;

    public MatiereService(IMatiereRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MatiereDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return entities.Select(e => MapToDto(e));
    }

    public async Task<MatiereDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity != null ? MapToDto(entity) : null;
    }

    public async Task<MatiereDto> CreateAsync(CreateMatiereDto dto)
    {
        var entity = MapToEntity(dto);
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<MatiereDto?> UpdateAsync(int id, CreateMatiereDto dto)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return null;

        UpdateEntity(entity, dto);
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

    private static Matiere MapToEntity(CreateMatiereDto dto) => new Matiere
    {
        Code = dto.Code,
        Nom = dto.Nom,
        Description = dto.Description,
        Mention = dto.Mention,
        MentionId = dto.MentionId,
        Parcours = dto.Parcours,
        ParcoursNom = dto.ParcoursNom,
        Niveau = dto.Niveau,
        Semestre = dto.Semestre,
        Type = dto.Type,
        Credits = dto.Credits,
        Couleur = dto.Couleur,
        Coefficient = dto.Coefficient,
        Statut = dto.Statut,
        VolumeCours = dto.VolumeCours,
        VolumeTd = dto.VolumeTd,
        VolumeTp = dto.VolumeTp,
        VolumeProjet = dto.VolumeProjet
    };

    private static void UpdateEntity(Matiere entity, CreateMatiereDto dto)
    {
        entity.Code = dto.Code;
        entity.Nom = dto.Nom;
        entity.Description = dto.Description;
        entity.Mention = dto.Mention;
        entity.MentionId = dto.MentionId;
        entity.Parcours = dto.Parcours;
        entity.ParcoursNom = dto.ParcoursNom;
        entity.Niveau = dto.Niveau;
        entity.Semestre = dto.Semestre;
        entity.Type = dto.Type;
        entity.Credits = dto.Credits;
        entity.Couleur = dto.Couleur;
        entity.Coefficient = dto.Coefficient;
        entity.Statut = dto.Statut;
        entity.VolumeCours = dto.VolumeCours;
        entity.VolumeTd = dto.VolumeTd;
        entity.VolumeTp = dto.VolumeTp;
        entity.VolumeProjet = dto.VolumeProjet;
    }

    private static MatiereDto MapToDto(Matiere e) => new MatiereDto
    {
        Id = e.Id,
        Code = e.Code,
        Nom = e.Nom,
        Description = e.Description,
        Mention = e.Mention,
        MentionId = e.MentionId,
        Parcours = e.Parcours,
        ParcoursNom = e.ParcoursNom,
        Niveau = e.Niveau,
        Semestre = e.Semestre,
        Type = e.Type,
        Credits = e.Credits,
        Couleur = e.Couleur,
        Coefficient = e.Coefficient,
        Statut = e.Statut,
        VolumeCours = e.VolumeCours,
        VolumeTd = e.VolumeTd,
        VolumeTp = e.VolumeTp,
        VolumeProjet = e.VolumeProjet
    };
}
