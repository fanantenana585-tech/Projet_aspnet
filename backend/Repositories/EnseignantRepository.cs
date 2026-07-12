using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class EnseignantRepository : Repository<Enseignant>, IEnseignantRepository
{
    public EnseignantRepository(AppDbContext context) : base(context)
    {
    }
}
