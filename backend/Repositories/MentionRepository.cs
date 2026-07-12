using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class MentionRepository : Repository<Mention>, IMentionRepository
{
    public MentionRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Mention>> GetFullStructureAsync()
    {
        return await _context.Mentions
            .Include(m => m.Parcours)
                .ThenInclude(p => p.ResponsableEnseignant)
            .ToListAsync();
    }
}
