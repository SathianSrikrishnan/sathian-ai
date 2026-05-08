param(
  [ValidateSet("pitch", "technical")]
  [string]$Kind = "pitch",
  [string]$VoiceId = "",
  [int]$Limit = 6,
  [string]$BaseUrl = "http://127.0.0.1:3000"
)

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $repo ".env.local"

if (!(Test-Path -LiteralPath $envPath)) {
  throw ".env.local not found at $envPath"
}

$voicePin = ""
Get-Content -LiteralPath $envPath | ForEach-Object {
  if ($_ -match "^\s*VOICE_PIN\s*=\s*(.+?)\s*$") {
    $voicePin = $Matches[1].Trim().Trim('"').Trim("'")
  }
}

if (!$voicePin) {
  throw "VOICE_PIN is missing from .env.local"
}

$body = @{
  kind = $Kind
  limit = $Limit
}

if ($VoiceId.Trim()) {
  $body.voiceId = $VoiceId.Trim()
}

$json = $body | ConvertTo-Json -Depth 4
$uri = "$BaseUrl/api/toothfairy/colosseum/voiceover"

Invoke-RestMethod `
  -Uri $uri `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ "x-voice-pin" = $voicePin } `
  -Body $json
