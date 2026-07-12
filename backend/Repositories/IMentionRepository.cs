using backend.Models;

namespace backend.Repositories;

public interface IMentionRepository : IRepository<Mention>
{
    Task<IEnumerable<Mention>> GetFullStructureAsync();
}
