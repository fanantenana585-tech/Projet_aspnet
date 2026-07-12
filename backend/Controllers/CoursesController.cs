using backend.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly IRepository<Course> _repository;

    public CoursesController(IRepository<Course> repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var entities = await _repository.GetAllAsync();
        return Ok(entities.Select(e => new CourseDto
        {
            Id = e.Id,
            Nom = e.Nom,
            Departement = e.Departement,
            Promotion = e.Promotion,
            ProfesseurId = e.ProfesseurId,
            Salle = e.Salle,
            Jour = e.Jour,
            Creneau = e.Creneau,
            CreatedAt = e.CreatedAt
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        var entity = new Course
        {
            Nom = dto.Nom,
            Departement = dto.Departement,
            Promotion = dto.Promotion,
            ProfesseurId = dto.ProfesseurId,
            Salle = dto.Salle,
            Jour = dto.Jour,
            Creneau = dto.Creneau,
            CreatedAt = DateTime.UtcNow
        };
        await _repository.AddAsync(entity);
        await _repository.SaveChangesAsync();

        return Ok(new CourseDto
        {
            Id = entity.Id,
            Nom = entity.Nom,
            Departement = entity.Departement,
            Promotion = entity.Promotion,
            ProfesseurId = entity.ProfesseurId,
            Salle = entity.Salle,
            Jour = entity.Jour,
            Creneau = entity.Creneau,
            CreatedAt = entity.CreatedAt
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return NotFound();

        _repository.Remove(entity);
        await _repository.SaveChangesAsync();
        return NoContent();
    }
}
