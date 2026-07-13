using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/filieres")]
public class FiliereController : ControllerBase
{
    private readonly IFiliereService _service;

    public FiliereController(IFiliereService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetFullStructure()
    {
        return Ok(await _service.GetFullStructureAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetParcours(int id)
    {
        try
        {
            var result = await _service.GetParcoursAsync(id);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("parcours")]
    public async Task<IActionResult> CreateParcours([FromBody] CreateParcoursDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var result = await _service.CreateParcoursAsync(dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("parcours/{id}")]
    public async Task<IActionResult> UpdateParcours(int id, [FromBody] UpdateParcoursDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != dto.Id)
        {
            return BadRequest(new { message = "L'ID du parcours ne correspond pas." });
        }

        try
        {
            var result = await _service.UpdateParcoursAsync(dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("parcours/{id}")]
    public async Task<IActionResult> DeleteParcours(int id)
    {
        var result = await _service.DeleteParcoursAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
