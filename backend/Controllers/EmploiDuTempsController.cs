using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/emploidutemps")]
public class EmploiDuTempsController : ControllerBase
{
    private readonly IEmploiService _service;
    private readonly INotificationService _notifier;

    public EmploiDuTempsController(IEmploiService service, INotificationService notifier)
    {
        _service = service;
        _notifier = notifier;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmploiDto dto)
    {
        var result = await _service.CreateAsync(dto);
        await _notifier.NotifyAllAsync(new { type = "emploi_created", title = "Emploi créé", body = $"Emploi {result.Id} créé", payload = result, timestamp = DateTime.UtcNow });
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateEmploiDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        await _notifier.NotifyAllAsync(new { type = "emploi_updated", title = "Emploi modifié", body = $"Emploi {result.Id} modifié", payload = result, timestamp = DateTime.UtcNow });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        await _notifier.NotifyAllAsync(new { type = "emploi_deleted", title = "Emploi supprimé", body = $"Emploi {id} supprimé", payload = new { id }, timestamp = DateTime.UtcNow });
        return NoContent();
    }
}
