using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class FiliereService : IFiliereService
{
    private readonly IMentionRepository _mentionRepository;
    private readonly IRepository<Parcours> _parcoursRepository;

    public FiliereService(IMentionRepository mentionRepository, IRepository<Parcours> parcoursRepository)
    {
        _mentionRepository = mentionRepository;
        _parcoursRepository = parcoursRepository;
    }

    public async Task<IEnumerable<MentionDto>> GetFullStructureAsync()
    {
        var mentions = await _mentionRepository.GetFullStructureAsync();
        return mentions.Select(m => new MentionDto
        {
            Id = m.Id,
            Nom = m.Nom,
            Icone = m.Icone,
            Couleur = m.Couleur,
            ResponsableNom = m.ResponsableNom,
            ResponsablePrenom = m.ResponsablePrenom,
            NbEtudiantsTotal = m.Parcours.Sum(p => p.NbEtudiants),
            Parcours = m.Parcours.Select(p => new ParcoursDto
            {
                Id = p.Id,
                Code = p.Code,
                Nom = p.Nom,
                Description = p.Description,
                Niveau = p.Niveau,
                NbEtudiants = p.NbEtudiants,
                OuvertConcours = p.OuvertConcours,
                Actif = p.Actif,
                MentionId = m.Id,
                ResponsableEnseignantId = p.ResponsableEnseignantId,
                ResponsableEnseignant = p.ResponsableEnseignant != null ? new EnseignantDto
                {
                    Id = p.ResponsableEnseignant.Id,
                    Nom = p.ResponsableEnseignant.Nom,
                    Prenom = p.ResponsableEnseignant.Prenom,
                    Specialite = p.ResponsableEnseignant.Specialite,
                    Statut = p.ResponsableEnseignant.Statut,
                    Email = p.ResponsableEnseignant.Email,
                    Initiales = p.ResponsableEnseignant.Initiales
                } : null
            })
        });
    }

    public async Task<ParcoursDto> CreateParcoursAsync(CreateParcoursDto dto)
    {
        // Vérifier si un parcours avec le même code existe déjà
        var existingByCode = await _parcoursRepository.FindAsync(p => p.Code.ToLower() == dto.Code.ToLower());
        if (existingByCode.Any())
        {
            throw new InvalidOperationException($"Un parcours avec le code '{dto.Code}' existe déjà.");
        }

        // Vérifier si un parcours avec le même nom existe déjà dans la même mention
        var existingByName = await _parcoursRepository.FindAsync(p => 
            p.Nom.ToLower() == dto.Nom.ToLower() && p.MentionId == dto.MentionId);
        if (existingByName.Any())
        {
            throw new InvalidOperationException($"Un parcours nommé '{dto.Nom}' existe déjà dans cette mention.");
        }

        var entity = new Parcours
        {
            Code = dto.Code,
            Nom = dto.Nom,
            Description = dto.Description,
            Niveau = dto.Niveau,
            NbEtudiants = dto.NbEtudiants,
            OuvertConcours = dto.OuvertConcours,
            Actif = dto.Actif,
            MentionId = dto.MentionId,
            ResponsableEnseignantId = dto.ResponsableEnseignantId
        };
        await _parcoursRepository.AddAsync(entity);
        await _parcoursRepository.SaveChangesAsync();

        return new ParcoursDto
        {
            Id = entity.Id,
            Code = entity.Code,
            Nom = entity.Nom,
            Description = entity.Description,
            Niveau = entity.Niveau,
            NbEtudiants = entity.NbEtudiants,
            OuvertConcours = entity.OuvertConcours,
            Actif = entity.Actif,
            MentionId = entity.MentionId,
            ResponsableEnseignantId = entity.ResponsableEnseignantId
        };
    }

    public async Task<bool> DeleteParcoursAsync(int id)
    {
        var entity = await _parcoursRepository.GetByIdAsync(id);
        if (entity == null) return false;

        _parcoursRepository.Remove(entity);
        await _parcoursRepository.SaveChangesAsync();
        return true;
    }
}
