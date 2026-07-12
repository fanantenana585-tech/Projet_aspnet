using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class SalleRepository : Repository<Salle>, ISalleRepository
{
    public SalleRepository(AppDbContext context) : base(context)
    {
    }
}
