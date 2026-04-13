using FluentValidation;
using MustGraduationPlatform.Application.Common;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Validators;

public class IdentifyRequestValidator : AbstractValidator<IdentifyRequestDto>
{
    public IdentifyRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .Must(MustEmailRules.IsValidLoginIdentifier)
            .WithMessage("VALIDATION_LOGIN_IDENTIFIER");
    }
}
