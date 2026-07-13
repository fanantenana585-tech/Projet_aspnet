using System.Globalization;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EmploiService : IEmploiService
{
    private readonly IEmploiRepository _repository;
    private readonly IRepository<Parcours> _parcoursRepository;

    public EmploiService(IEmploiRepository repository, IRepository<Parcours> parcoursRepository)
    {
        _repository = repository;
        _parcoursRepository = parcoursRepository;
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
        // Attempt to infer missing fields from related tables
        string? mentionId = dto.MentionId;
        string? parcoursId = dto.ParcoursId;

        // If a parcours id or code was provided (string), try to resolve to an existing parcours
        if (string.IsNullOrWhiteSpace(parcoursId) && !string.IsNullOrWhiteSpace(dto.Title))
        {
            // Try to detect parcours code inside the Title (e.g. "DA2I")
            var parts = dto.Title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                var matches = await _parcoursRepository.FindAsync(p => p.Code.ToLower() == part.ToLower());
                var first = matches.FirstOrDefault();
                if (first != null)
                {
                    parcoursId = first.Id.ToString();
                    mentionId = first.MentionId;
                    if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
                    break;
                }
            }
        }

        // If parcoursId provided but mentionId missing, pull mention from parcours
        if (!string.IsNullOrWhiteSpace(parcoursId) && string.IsNullOrWhiteSpace(mentionId))
        {
            var matches = await _parcoursRepository.FindAsync(p => p.Id.ToString() == parcoursId || p.Code.ToLower() == parcoursId.ToLower());
            var first = matches.FirstOrDefault();
            if (first != null)
            {
                parcoursId = first.Id.ToString();
                mentionId = first.MentionId;
                if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
            }
        }

        // If mention provided but parcours missing, try to find a matching parcours (by niveau if available)
        if (!string.IsNullOrWhiteSpace(mentionId) && string.IsNullOrWhiteSpace(parcoursId))
        {
            IEnumerable<Parcours> candidates;
            if (!string.IsNullOrWhiteSpace(dto.Niveau))
            {
                candidates = await _parcoursRepository.FindAsync(p => p.MentionId == mentionId && p.Niveau == dto.Niveau);
            }
            else
            {
                candidates = await _parcoursRepository.FindAsync(p => p.MentionId == mentionId);
            }
            var first = candidates.FirstOrDefault();
            if (first != null)
            {
                parcoursId = first.Id.ToString();
                // Fill niveau from parcours when available
                if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
            }
        }

        // If Jour is missing, derive from StartTime
        if (string.IsNullOrWhiteSpace(dto.Jour))
        {
            try
            {
                dto.Jour = dto.StartTime.ToString("dddd", new CultureInfo("fr-FR"));
            }
            catch
            {
                dto.Jour = null;
            }
        }

        var entity = new EmploiDuTemps
        {
            Title = dto.Title,
            Description = dto.Description,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Salle = dto.Salle,
            Enseignant = dto.Enseignant,
            Type = dto.Type,
            MentionId = mentionId,
            ParcoursId = parcoursId,
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

        // Inference logic for update as well
        string? mentionId = dto.MentionId ?? entity.MentionId;
        string? parcoursId = dto.ParcoursId ?? entity.ParcoursId;

        // Try detect parcours code in Title if needed
        if (string.IsNullOrWhiteSpace(parcoursId) && !string.IsNullOrWhiteSpace(dto.Title))
        {
            var parts = dto.Title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in parts)
            {
                var matches = await _parcoursRepository.FindAsync(p => p.Code.ToLower() == part.ToLower());
                var first = matches.FirstOrDefault();
                if (first != null)
                {
                    parcoursId = first.Id.ToString();
                    mentionId = first.MentionId;
                    if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
                    break;
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(parcoursId) && string.IsNullOrWhiteSpace(mentionId))
        {
            var matches = await _parcoursRepository.FindAsync(p => p.Id.ToString() == parcoursId || p.Code.ToLower() == parcoursId.ToLower());
            var first = matches.FirstOrDefault();
            if (first != null)
            {
                parcoursId = first.Id.ToString();
                mentionId = first.MentionId;
                if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
            }
        }

        if (!string.IsNullOrWhiteSpace(mentionId) && string.IsNullOrWhiteSpace(parcoursId))
        {
            IEnumerable<Parcours> candidates;
            if (!string.IsNullOrWhiteSpace(dto.Niveau))
            {
                candidates = await _parcoursRepository.FindAsync(p => p.MentionId == mentionId && p.Niveau == dto.Niveau);
            }
            else
            {
                candidates = await _parcoursRepository.FindAsync(p => p.MentionId == mentionId);
            }
            var first = candidates.FirstOrDefault();
            if (first != null)
            {
                parcoursId = first.Id.ToString();
                if (string.IsNullOrWhiteSpace(dto.Niveau)) dto.Niveau = first.Niveau;
            }
        }

        if (string.IsNullOrWhiteSpace(dto.Jour))
        {
            try { dto.Jour = dto.StartTime.ToString("dddd", new CultureInfo("fr-FR")); }
            catch { dto.Jour = entity.Jour; }
        }

        entity.Title = dto.Title;
        entity.Description = dto.Description;
        entity.StartTime = dto.StartTime;
        entity.EndTime = dto.EndTime;
        entity.Salle = dto.Salle;
        entity.Enseignant = dto.Enseignant;
        entity.Type = dto.Type;
        entity.MentionId = mentionId;
        entity.ParcoursId = parcoursId;
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
