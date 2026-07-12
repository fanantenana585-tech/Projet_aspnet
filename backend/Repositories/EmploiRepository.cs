using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class EmploiRepository : Repository<EmploiDuTemps>, IEmploiRepository
{
    public EmploiRepository(AppDbContext context) : base(context)
    {
    }
}
