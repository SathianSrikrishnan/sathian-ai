param(
  [ValidateSet('pitch', 'technical', 'both')]
  [string]$Mode = 'both'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$exportDir = Join-Path $repoRoot 'public\colosseum-frontier-2026\exports'
New-Item -ItemType Directory -Force -Path $exportDir | Out-Null

function Render-Storyboard {
  param(
    [string]$CompositionId,
    [string]$OutputName
  )

  $outputPath = Join-Path $exportDir $OutputName
  $remotion = Join-Path $repoRoot 'node_modules\.bin\remotion.cmd'
  if (-not (Test-Path -LiteralPath $remotion)) {
    throw "Could not find local Remotion CLI at $remotion"
  }

  Push-Location $repoRoot
  try {
    & $remotion render $CompositionId $outputPath
  } finally {
    Pop-Location
  }
}

if ($Mode -eq 'pitch' -or $Mode -eq 'both') {
  Render-Storyboard 'Colosseum-Pitch-Storyboard' 'colosseum-pitch-storyboard.mp4'
}

if ($Mode -eq 'technical' -or $Mode -eq 'both') {
  Render-Storyboard 'Colosseum-Technical-Storyboard' 'colosseum-technical-storyboard.mp4'
}
