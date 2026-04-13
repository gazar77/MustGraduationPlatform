using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/idea-categories")]
public class IdeaCategoriesController : ControllerBase
{
    private readonly IIdeaCategoryService _categories;

    public IdeaCategoriesController(IIdeaCategoryService categories)
    {
        _categories = categories;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<IdeaCategoryDto>>> GetVisible(CancellationToken ct)
        => Ok(await _categories.GetVisibleAsync(ct));

    [HttpGet("manage")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<IdeaCategoryDto>>> GetAll(CancellationToken ct)
        => Ok(await _categories.GetAllAsync(ct));

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IdeaCategoryDto>> Create([FromBody] IdeaCategoryCreateUpdateDto dto, CancellationToken ct)
        => Ok(await _categories.CreateAsync(dto, ct));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<IdeaCategoryDto>> Update(int id, [FromBody] IdeaCategoryCreateUpdateDto dto, CancellationToken ct)
    {
        var r = await _categories.UpdateAsync(id, dto, ct);
        return r is null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
        => await _categories.DeleteAsync(id, ct) ? NoContent() : NotFound();
}
