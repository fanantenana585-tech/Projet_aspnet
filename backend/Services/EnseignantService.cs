using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EnseignantService : IEnseignantService
{
    private readonly IEnseignantRepository _repository;

    public EnseignantService(IEnseignantRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EnseignantDto>> GetAllAsync()
    {
        var enseignants = await _repository.GetAllAsync();
        return enseignants.Select(e => MapToDto(e));
    }

    public async Task<EnseignantDto?> GetByIdAsync(int id)
    {
        var enseignant = await _repository.GetByIdAsync(id);
        return enseignant != null ? MapToDto(enseignant) : null;
    }

    public async Task<EnseignantDto> CreateAsync(CreateEnseignantDto dto)
    {
        var enseignant = new Enseignant
        {
            Nom = dto.Nom,
            Prenom = dto.Prenom,
            Email = dto.Email,
            Specialite = dto.Specialite,
            Statut = dto.Statut,
            PhoneNumber = dto.Telephone,
            Initiales = !string.IsNullOrWhiteSpace(dto.Initiales) ? dto.Initiales : GenerateInitials(dto.Nom, dto.Prenom)
        };
        await _repository.AddAsync(enseignant);
        await _repository.SaveChangesAsync();
        return MapToDto(enseignant);
    }

    public async Task<EnseignantDto?> UpdateAsync(int id, CreateEnseignantDto dto)
    {
        var enseignant = await _repository.GetByIdAsync(id);
        if (enseignant == null) return null;

        enseignant.Nom = dto.Nom;
        enseignant.Prenom = dto.Prenom;
        enseignant.Email = dto.Email;
        enseignant.Specialite = dto.Specialite;
        enseignant.Statut = dto.Statut;
        enseignant.PhoneNumber = dto.Telephone;
        enseignant.Initiales = !string.IsNullOrWhiteSpace(dto.Initiales) ? dto.Initiales : GenerateInitials(dto.Nom, dto.Prenom);

        _repository.Update(enseignant);
        await _repository.SaveChangesAsync();
        return MapToDto(enseignant);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var enseignant = await _repository.GetByIdAsync(id);
        if (enseignant == null) return false;

        _repository.Remove(enseignant);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static EnseignantDto MapToDto(Enseignant e) => new EnseignantDto
    {
        Id = e.Id,
        Nom = e.Nom,
        Prenom = e.Prenom,
        Email = e.Email,
        Specialite = e.Specialite,
        Statut = e.Statut,
        Telephone = e.PhoneNumber,
        Initiales = e.Initiales
    };

    private static string GenerateInitials(string nom, string prenom)
    {
        var first = string.Empty;
        var last = string.Empty;
        if (!string.IsNullOrWhiteSpace(prenom))
        {
            var parts = prenom.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            first = parts.Length > 0 && parts[0].Length > 0 ? parts[0][0].ToString().ToUpper() : string.Empty;
        }
        if (!string.IsNullOrWhiteSpace(nom))
        {
            last = nom.Trim()[0].ToString().ToUpper();
        }
        var initials = (first + last).ToUpper();
        return string.IsNullOrWhiteSpace(initials) ? "-" : initials;
    }
}
