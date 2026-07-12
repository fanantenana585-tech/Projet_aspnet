using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class MatiereRepository : Repository<Matiere>, IMatiereRepository
{
    public MatiereRepository(AppDbContext context) : base(context)
    {
    }
}
