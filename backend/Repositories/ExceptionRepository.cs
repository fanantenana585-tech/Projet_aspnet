using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class ExceptionRepository : Repository<PlanningException>, IExceptionRepository
{
    public ExceptionRepository(AppDbContext context) : base(context)
    {
    }
}
