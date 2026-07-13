using backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Services;

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationsHub> _hub;

    public NotificationService(IHubContext<NotificationsHub> hub)
    {
        _hub = hub;
    }

    public async Task NotifyAllAsync(object message)
    {
        await _hub.Clients.All.SendAsync("ReceiveNotification", message);
    }
}
