using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/exceptions")]
public class PlanningExceptionController : ControllerBase
{
    private readonly IExceptionService _service;
    private readonly INotificationService _notifier;

    public PlanningExceptionController(IExceptionService service, INotificationService notifier)
    {
        _service = service;
        _notifier = notifier;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExceptionDto dto)
    {
        var result = await _service.CreateAsync(dto);
        await _notifier.NotifyAllAsync(new { type = "exception_created", title = "Exception planning", body = "Une exception a été ajoutée", payload = result, timestamp = DateTime.UtcNow });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        await _notifier.NotifyAllAsync(new { type = "exception_deleted", title = "Exception supprimée", body = $"Exception {id} supprimée", payload = new { id }, timestamp = DateTime.UtcNow });
        return NoContent();
    }
}
