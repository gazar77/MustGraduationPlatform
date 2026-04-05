# Publishes the API for MonsterASP.net (framework-dependent Release build).
# Deletes the existing ./publish folder first so each run is a clean output.
$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$csproj = Join-Path $root 'MustGraduationPlatform.Api\MustGraduationPlatform.Api.csproj'
$outDir = Join-Path $root 'publish'

if (-not (Test-Path $csproj)) {
    Write-Error "Project not found: $csproj"
    exit 1
}

if (Test-Path $outDir) {
    Write-Host "Removing existing publish folder: $outDir"
    Remove-Item -LiteralPath $outDir -Recurse -Force
}

Write-Host "Publishing Release to $outDir ..."
dotnet publish $csproj `
    --configuration Release `
    --output $outDir `
    --no-self-contained `
    --verbosity minimal

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Done. Upload the contents of:" -ForegroundColor Green
Write-Host "  $outDir" -ForegroundColor Green
