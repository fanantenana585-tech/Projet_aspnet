using backend.DTOs;

namespace backend.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(UserRegistrationDto dto);
    Task<AuthResponseDto?> LoginAsync(UserLoginDto dto);
}
