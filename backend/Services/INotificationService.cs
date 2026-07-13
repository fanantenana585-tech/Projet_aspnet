using System.Threading.Tasks;

namespace backend.Services;

public interface INotificationService
{
    Task NotifyAllAsync(object message);
}
