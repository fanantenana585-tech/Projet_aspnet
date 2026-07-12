using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly IRepository<UserSetting> _repository;

    public SettingsController(IRepository<UserSetting> repository)
    {
        _repository = repository;
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetSetting(string key)
    {
        var settings = await _repository.FindAsync(s => s.Key == key);
        var setting = settings.FirstOrDefault();
        if (setting == null) return NotFound();

        // Return as JSON object if possible, otherwise as string
        return Ok(JsonSerializer.Deserialize<object>(setting.Value));
    }

    [HttpPost("{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] object value)
    {
        var settings = await _repository.FindAsync(s => s.Key == key);
        var setting = settings.FirstOrDefault();
        var jsonValue = JsonSerializer.Serialize(value);

        if (setting == null)
        {
            setting = new UserSetting { Key = key, Value = jsonValue };
            await _repository.AddAsync(setting);
        }
        else
        {
            setting.Value = jsonValue;
            _repository.Update(setting);
        }

        await _repository.SaveChangesAsync();
        return Ok();
    }
}
