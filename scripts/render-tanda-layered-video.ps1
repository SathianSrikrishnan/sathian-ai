param(
  [int]$Width = 1440,
  [int]$Height = 900,
  [int]$Fps = 30,
  [int]$Frames = 288,
  [string]$OutputRoot = '',
  [string]$FfmpegPath = ''
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
  $OutputRoot = Join-Path $repoRoot ('.tmp\tanda-layered-render-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
}

$framesDir = Join-Path $OutputRoot 'frames'
$publicDir = Join-Path $repoRoot 'public\toothfairy\animation'
New-Item -ItemType Directory -Force -Path $framesDir | Out-Null
New-Item -ItemType Directory -Force -Path $publicDir | Out-Null

if ([string]::IsNullOrWhiteSpace($FfmpegPath)) {
  $ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($null -eq $ffmpegCommand) {
    $fallbackFfmpeg = Join-Path $env:USERPROFILE '.local\bin\ffmpeg.exe'
    if (Test-Path -LiteralPath $fallbackFfmpeg) {
      $FfmpegPath = $fallbackFfmpeg
    } else {
      throw 'ffmpeg was not found on PATH or in the expected local bin folder.'
    }
  } else {
    $FfmpegPath = $ffmpegCommand.Source
  }
}

$assetRoot = Join-Path $repoRoot 'public\toothfairy\animation\layered'
$posePackRoot = Join-Path $repoRoot 'public\toothfairy\animation\pose-pack'
$tandaWithToothPath = Join-Path $assetRoot 'tanda-cutout-soft.png'
$tandaAfterDropPath = Join-Path $assetRoot 'tanda-cutout-soft-no-tooth.png'
$piggyPath = Join-Path $assetRoot 'piggy-cutout-soft.png'
$piggyNoCoinPath = Join-Path $assetRoot 'piggy-cutout-soft-no-coin.png'
$keepsakePath = Join-Path $assetRoot 'keepsake-cutout-soft.png'
$tandaPoseFlyPath = Join-Path $posePackRoot 'tanda-01-fly-in-tooth.png'
$tandaPoseHoverPath = Join-Path $posePackRoot 'tanda-02-hover-tooth.png'
$tandaPoseReachPath = Join-Path $posePackRoot 'tanda-02b-reach-down-empty.png'
$tandaPoseDropPath = Join-Path $posePackRoot 'tanda-03-drop-tooth.png'
$tandaPoseRetractPath = Join-Path $posePackRoot 'tanda-03b-hand-retract-empty.png'
$tandaPoseFollowPath = Join-Path $posePackRoot 'tanda-04-follow-through.png'
$tandaPoseGuidePath = Join-Path $posePackRoot 'tanda-05-guide-coin.png'
$tandaPoseGuideDownPath = Join-Path $posePackRoot 'tanda-05b-guide-down-to-pig.png'
$tandaPosePigCelebratePath = Join-Path $posePackRoot 'tanda-05c-celebrate-pig-glow.png'
$tandaPoseCelebratePath = Join-Path $posePackRoot 'tanda-06-celebrate-exit.png'
$tandaWingOverlayPath = Join-Path $posePackRoot 'tanda-wing-overlay.png'
New-Item -ItemType Directory -Force -Path $posePackRoot | Out-Null

if ($true) {
  $sourcePiggy = [System.Drawing.Image]::FromFile($piggyPath)
  $cleanPiggy = New-Object System.Drawing.Bitmap $sourcePiggy.Width, $sourcePiggy.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $cleanGraphics = [System.Drawing.Graphics]::FromImage($cleanPiggy)
  $cleanGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $cleanGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $cleanGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $cleanGraphics.DrawImage($sourcePiggy, 0, 0, $sourcePiggy.Width, $sourcePiggy.Height)

  $cleanGraphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $transparentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $cleanGraphics.FillEllipse($transparentBrush, (New-Object System.Drawing.RectangleF(151, -12, 112, 105)))
  $transparentBrush.Dispose()
  $cleanGraphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver

  $slotGlow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(90, 255, 216, 90))
  $cleanGraphics.FillEllipse($slotGlow, (New-Object System.Drawing.RectangleF(172, 76, 72, 22)))
  $slotGlow.Dispose()
  $slotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(210, 54, 24, 22))
  $cleanGraphics.FillEllipse($slotBrush, (New-Object System.Drawing.RectangleF(177, 81, 62, 13)))
  $slotBrush.Dispose()

  $cleanPiggy.Save($piggyNoCoinPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $cleanGraphics.Dispose()
  $cleanPiggy.Dispose()
  $sourcePiggy.Dispose()
}

$piggyPath = $piggyNoCoinPath

function Load-ImageOrFallback {
  param([string]$CandidatePath, [string]$FallbackPath)
  if (Test-Path -LiteralPath $CandidatePath) {
    return [System.Drawing.Image]::FromFile($CandidatePath)
  }
  return [System.Drawing.Image]::FromFile($FallbackPath)
}

$posePackRequiredPaths = @(
  $tandaPoseFlyPath,
  $tandaPoseHoverPath,
  $tandaPoseReachPath,
  $tandaPoseDropPath,
  $tandaPoseRetractPath,
  $tandaPoseFollowPath,
  $tandaPoseGuidePath,
  $tandaPoseGuideDownPath,
  $tandaPosePigCelebratePath,
  $tandaPoseCelebratePath
)
$posePackReady = $true
foreach ($posePath in $posePackRequiredPaths) {
  if (!(Test-Path -LiteralPath $posePath)) {
    $posePackReady = $false
    break
  }
}

$tandaWithTooth = [System.Drawing.Image]::FromFile($tandaWithToothPath)
$tandaAfterDrop = [System.Drawing.Image]::FromFile($tandaAfterDropPath)
$tandaPoseFly = Load-ImageOrFallback $tandaPoseFlyPath $tandaWithToothPath
$tandaPoseHover = Load-ImageOrFallback $tandaPoseHoverPath $tandaWithToothPath
$tandaPoseReach = Load-ImageOrFallback $tandaPoseReachPath $tandaAfterDropPath
$tandaPoseDrop = Load-ImageOrFallback $tandaPoseDropPath $tandaWithToothPath
$tandaPoseRetract = Load-ImageOrFallback $tandaPoseRetractPath $tandaAfterDropPath
$tandaPoseFollow = Load-ImageOrFallback $tandaPoseFollowPath $tandaAfterDropPath
$tandaPoseGuide = Load-ImageOrFallback $tandaPoseGuidePath $tandaAfterDropPath
$tandaPoseGuideDown = Load-ImageOrFallback $tandaPoseGuideDownPath $tandaAfterDropPath
$tandaPosePigCelebrate = Load-ImageOrFallback $tandaPosePigCelebratePath $tandaAfterDropPath
$tandaPoseCelebrate = Load-ImageOrFallback $tandaPoseCelebratePath $tandaAfterDropPath
$tandaWingOverlay = $null
if (Test-Path -LiteralPath $tandaWingOverlayPath) {
  $tandaWingOverlay = [System.Drawing.Image]::FromFile($tandaWingOverlayPath)
}
$piggy = [System.Drawing.Image]::FromFile($piggyPath)
$keepsake = [System.Drawing.Image]::FromFile($keepsakePath)

$fontFamily = New-Object System.Drawing.FontFamily 'Segoe UI'
$storyFont = New-Object System.Drawing.Font $fontFamily, 12, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$coinFont = New-Object System.Drawing.Font $fontFamily, 42, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

function Clamp01 {
  param([double]$Value)
  if ($Value -lt 0) { return 0.0 }
  if ($Value -gt 1) { return 1.0 }
  return $Value
}

function Smooth01 {
  param([double]$Value)
  $t = Clamp01 $Value
  return $t * $t * (3 - (2 * $t))
}

function SmoothRange {
  param([double]$Start, [double]$End, [double]$Value)
  if ($End -eq $Start) { return 1.0 }
  return Smooth01 (($Value - $Start) / ($End - $Start))
}

function Lerp {
  param([double]$A, [double]$B, [double]$T)
  return $A + (($B - $A) * $T)
}

function Interp-Key {
  param([double]$Percent, [object[]]$Keys)
  if ($Percent -le [double]$Keys[0][0]) { return [double]$Keys[0][1] }
  for ($i = 0; $i -lt ($Keys.Count - 1); $i++) {
    $left = $Keys[$i]
    $right = $Keys[$i + 1]
    if ($Percent -le [double]$right[0]) {
      $t = SmoothRange ([double]$left[0]) ([double]$right[0]) $Percent
      return Lerp ([double]$left[1]) ([double]$right[1]) $t
    }
  }
  return [double]$Keys[$Keys.Count - 1][1]
}

function C {
  param([int]$Alpha, [int]$Red, [int]$Green, [int]$Blue)
  return [System.Drawing.Color]::FromArgb($Alpha, $Red, $Green, $Blue)
}

function New-RoundedRectPath {
  param([System.Drawing.RectangleF]$Rect, [double]$Radius)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = [single]($Radius * 2)
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Glow {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$RadiusX,
    [double]$RadiusY,
    [System.Drawing.Color]$Color,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }
  for ($i = 18; $i -ge 1; $i--) {
    $t = $i / 18.0
    $alpha = [int](255 * $Opacity * (0.02 + (0.11 * (1 - $t))))
    if ($alpha -lt 1) { continue }
    $brush = New-Object System.Drawing.SolidBrush (C $alpha $Color.R $Color.G $Color.B)
    $rect = New-Object System.Drawing.RectangleF (
      [single]($CenterX - ($RadiusX * $t)),
      [single]($CenterY - ($RadiusY * $t)),
      [single](2 * $RadiusX * $t),
      [single](2 * $RadiusY * $t)
    )
    $Graphics.FillEllipse($brush, $rect)
    $brush.Dispose()
  }
}

function Draw-ImageOpacity {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Image]$Image,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Width,
    [double]$Height,
    [double]$Rotation,
    [double]$ScaleX,
    [double]$ScaleY,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
  $Graphics.ScaleTransform([single]$ScaleX, [single]$ScaleY)

  $dest = New-Object System.Drawing.Rectangle (
    [int](-$Width / 2),
    [int](-$Height / 2),
    [int]$Width,
    [int]$Height
  )

  if ($Opacity -ge 0.999) {
    $Graphics.DrawImage($Image, $dest)
  } else {
    $matrix = New-Object System.Drawing.Imaging.ColorMatrix
    $matrix.Matrix33 = [single]$Opacity
    $attributes = New-Object System.Drawing.Imaging.ImageAttributes
    $attributes.SetColorMatrix(
      $matrix,
      [System.Drawing.Imaging.ColorMatrixFlag]::Default,
      [System.Drawing.Imaging.ColorAdjustType]::Bitmap
    )
    $Graphics.DrawImage(
      $Image,
      $dest,
      0,
      0,
      $Image.Width,
      $Image.Height,
      [System.Drawing.GraphicsUnit]::Pixel,
      $attributes
    )
    $attributes.Dispose()
  }

  $Graphics.Restore($state)
}

function Draw-ImageOpacityClipped {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Image]$Image,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Width,
    [double]$Height,
    [double]$Rotation,
    [double]$ScaleX,
    [double]$ScaleY,
    [double]$Opacity,
    [object[]]$ClipRects
  )

  if ($Opacity -le 0.001) { return }
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
  $Graphics.ScaleTransform([single]$ScaleX, [single]$ScaleY)

  $clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  foreach ($clip in $ClipRects) {
    $clipX = [double]$clip[0]
    $clipY = [double]$clip[1]
    $clipW = [double]$clip[2]
    $clipH = [double]$clip[3]
    $clipPath.AddRectangle((New-Object System.Drawing.RectangleF(
      [single]((-$Width / 2) + (($clipX / $Image.Width) * $Width)),
      [single]((-$Height / 2) + (($clipY / $Image.Height) * $Height)),
      [single](($clipW / $Image.Width) * $Width),
      [single](($clipH / $Image.Height) * $Height)
    )))
  }
  $Graphics.SetClip($clipPath)

  $dest = New-Object System.Drawing.Rectangle (
    [int](-$Width / 2),
    [int](-$Height / 2),
    [int]$Width,
    [int]$Height
  )

  $matrix = New-Object System.Drawing.Imaging.ColorMatrix
  $matrix.Matrix33 = [single]$Opacity
  $attributes = New-Object System.Drawing.Imaging.ImageAttributes
  $attributes.SetColorMatrix(
    $matrix,
    [System.Drawing.Imaging.ColorMatrixFlag]::Default,
    [System.Drawing.Imaging.ColorAdjustType]::Bitmap
  )
  $Graphics.DrawImage(
    $Image,
    $dest,
    0,
    0,
    $Image.Width,
    $Image.Height,
    [System.Drawing.GraphicsUnit]::Pixel,
    $attributes
  )

  $attributes.Dispose()
  $clipPath.Dispose()
  $Graphics.Restore($state)
}

function Get-TandaState {
  param([double]$Percent)

  $size = 390

  if ($Percent -le 38) {
    $u = SmoothRange 0 38 $Percent
    $x = Lerp ($Width * -0.05) ($Width * 0.43) $u
    $y = (Lerp ($Height * 0.26) ($Height * 0.42) $u) - ([Math]::Sin($u * [Math]::PI) * $Height * 0.12)
  } elseif ($Percent -le 68) {
    $u = SmoothRange 38 68 $Percent
    $x = Lerp ($Width * 0.43) ($Width * 0.56) $u
    $y = (Lerp ($Height * 0.42) ($Height * 0.32) $u) - ([Math]::Sin($u * [Math]::PI) * $Height * 0.05)
  } elseif ($Percent -le 90) {
    $u = SmoothRange 68 90 $Percent
    $x = Lerp ($Width * 0.56) ($Width * 0.79) $u
    $y = (Lerp ($Height * 0.32) ($Height * 0.47) $u) - ([Math]::Sin($u * [Math]::PI) * $Height * 0.08)
  } else {
    $u = SmoothRange 90 100 $Percent
    $x = Lerp ($Width * 0.79) ($Width * 0.92) $u
    $y = (Lerp ($Height * 0.47) ($Height * 0.33) $u) - ([Math]::Sin($u * [Math]::PI) * $Height * 0.04)
  }

  $rot = Interp-Key $Percent @(@(0, -9), @(18, -2), @(34, 6), @(42, 1), @(62, -5), @(78, 3), @(90, 4), @(100, -2))
  $scale = Interp-Key $Percent @(@(0, 0.68), @(10, 0.78), @(28, 0.96), @(38, 1.02), @(54, 0.90), @(70, 0.82), @(90, 0.78), @(100, 0.66))
  $baseOpacity = Interp-Key $Percent @(@(0, 0), @(6, 1), @(94, 1), @(100, 0))
  $withTooth = Interp-Key $Percent @(@(0, 1), @(36, 1), @(39, 0), @(100, 0))
  $afterDrop = Interp-Key $Percent @(@(0, 0), @(36, 0), @(39, 1), @(94, 1), @(100, 0))

  return [pscustomobject]@{
    X = $x
    Y = $y
    Rotation = $rot
    Scale = $scale
    Size = $size
    Opacity = $baseOpacity
    WithTooth = $withTooth
    AfterDrop = $afterDrop
  }
}

function Get-TandaPoint {
  param(
    [object]$State,
    [double]$LocalX,
    [double]$LocalY
  )

  $dx = ((($LocalX / $script:tandaWithTooth.Width) * $State.Size) - ($State.Size / 2)) * $State.Scale
  $dy = ((($LocalY / $script:tandaWithTooth.Height) * $State.Size) - ($State.Size / 2)) * $State.Scale
  $rad = $State.Rotation * [Math]::PI / 180
  $rx = ($dx * [Math]::Cos($rad)) - ($dy * [Math]::Sin($rad))
  $ry = ($dx * [Math]::Sin($rad)) + ($dy * [Math]::Cos($rad))
  return @(([double]$State.X + $rx), ([double]$State.Y + $ry))
}

function Get-TandaPoseImage {
  param([double]$Percent)
  if ($Percent -lt 25) { return $script:tandaPoseFly }
  if ($Percent -lt 33) { return $script:tandaPoseHover }
  if ($Percent -lt 47) { return $script:tandaPoseReach }
  if ($Percent -lt 54) { return $script:tandaPoseRetract }
  if ($Percent -lt 70) { return $script:tandaPoseFollow }
  if ($Percent -lt 80) { return $script:tandaPoseGuide }
  if ($Percent -lt 90) { return $script:tandaPoseGuideDown }
  if ($Percent -lt 98) { return $script:tandaPosePigCelebrate }
  return $script:tandaPoseCelebrate
}

function New-PoseLayer {
  param([System.Drawing.Image]$Image, [double]$Opacity)
  return [pscustomobject]@{
    Image = $Image
    Opacity = Clamp01 $Opacity
  }
}

function Get-TandaPoseLayers {
  param([double]$Percent)

  if ($Percent -lt 23) {
    return @(New-PoseLayer $script:tandaPoseFly 1)
  }
  if ($Percent -lt 29) {
    $t = SmoothRange 23 29 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseFly (1 - $t)),
      (New-PoseLayer $script:tandaPoseHover $t)
    )
  }
  if ($Percent -lt 31) {
    return @(New-PoseLayer $script:tandaPoseHover 1)
  }
  if ($Percent -lt 36) {
    $t = SmoothRange 31 36 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseHover (1 - $t)),
      (New-PoseLayer $script:tandaPoseReach $t)
    )
  }
  if ($Percent -lt 39) {
    return @(New-PoseLayer $script:tandaPoseReach 1)
  }
  if ($Percent -lt 47) {
    return @(New-PoseLayer $script:tandaPoseReach 1)
  }
  if ($Percent -lt 52) {
    $t = SmoothRange 47 52 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseReach (1 - $t)),
      (New-PoseLayer $script:tandaPoseRetract $t)
    )
  }
  if ($Percent -lt 57) {
    return @(New-PoseLayer $script:tandaPoseRetract 1)
  }
  if ($Percent -lt 63) {
    $t = SmoothRange 57 63 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseRetract (1 - $t)),
      (New-PoseLayer $script:tandaPoseFollow $t)
    )
  }
  if ($Percent -lt 68) {
    return @(New-PoseLayer $script:tandaPoseFollow 1)
  }
  if ($Percent -lt 74) {
    $t = SmoothRange 68 74 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseFollow (1 - $t)),
      (New-PoseLayer $script:tandaPoseGuide $t)
    )
  }
  if ($Percent -lt 79) {
    return @(New-PoseLayer $script:tandaPoseGuide 1)
  }
  if ($Percent -lt 84) {
    $t = SmoothRange 79 84 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseGuide (1 - $t)),
      (New-PoseLayer $script:tandaPoseGuideDown $t)
    )
  }
  if ($Percent -lt 89) {
    return @(New-PoseLayer $script:tandaPoseGuideDown 1)
  }
  if ($Percent -lt 94) {
    $t = SmoothRange 89 94 $Percent
    return @(
      (New-PoseLayer $script:tandaPoseGuideDown (1 - $t)),
      (New-PoseLayer $script:tandaPosePigCelebrate $t)
    )
  }
  if ($Percent -lt 97) {
    return @(New-PoseLayer $script:tandaPosePigCelebrate 1)
  }
  if ($Percent -lt 100) {
    $t = SmoothRange 97 100 $Percent
    return @(
      (New-PoseLayer $script:tandaPosePigCelebrate (1 - $t)),
      (New-PoseLayer $script:tandaPoseCelebrate $t)
    )
  }
  return @(New-PoseLayer $script:tandaPoseCelebrate 1)
}

function Draw-Sparkle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$X,
    [double]$Y,
    [double]$Size,
    [double]$Opacity
  )
  if ($Opacity -le 0.001) { return }

  Draw-Glow $Graphics $X $Y ($Size * 2.2) ($Size * 2.2) (C 255 255 226 145) ($Opacity * 0.45)

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddPolygon([System.Drawing.PointF[]]@(
      (New-Object System.Drawing.PointF([single]$X, [single]($Y - $Size))),
      (New-Object System.Drawing.PointF([single]($X + ($Size * 0.32)), [single]($Y - ($Size * 0.25)))),
      (New-Object System.Drawing.PointF([single]($X + $Size), [single]$Y)),
      (New-Object System.Drawing.PointF([single]($X + ($Size * 0.32)), [single]($Y + ($Size * 0.25)))),
      (New-Object System.Drawing.PointF([single]$X, [single]($Y + $Size))),
      (New-Object System.Drawing.PointF([single]($X - ($Size * 0.32)), [single]($Y + ($Size * 0.25)))),
      (New-Object System.Drawing.PointF([single]($X - $Size), [single]$Y)),
      (New-Object System.Drawing.PointF([single]($X - ($Size * 0.32)), [single]($Y - ($Size * 0.25))))
    ))

  $brush = New-Object System.Drawing.SolidBrush (C ([int](230 * $Opacity)) 255 243 188)
  $Graphics.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function Draw-Tooth {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Width,
    [double]$Rotation,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }

  $height = $Width * 84 / 74
  Draw-Glow $Graphics $CenterX $CenterY ($Width * 0.78) ($height * 0.76) (C 255 255 219 133) ($Opacity * 0.72)

  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
  $scale = $Width / 74.0
  $Graphics.ScaleTransform([single]$scale, [single]$scale)
  $Graphics.TranslateTransform(-37, -42)

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.StartFigure()
  $path.AddBezier(36.7, 6.4, 46.5, 0.9, 61.3, 7.4, 64.4, 20.0)
  $path.AddBezier(64.4, 20.0, 67.2, 31.3, 60.9, 44.9, 57.2, 55.2)
  $path.AddBezier(57.2, 55.2, 54.7, 62.2, 53.7, 75.4, 46.1, 75.9)
  $path.AddBezier(46.1, 75.9, 40.7, 76.3, 41.9, 62.4, 36.5, 62.4)
  $path.AddBezier(36.5, 62.4, 31.3, 62.4, 31.7, 75.9, 26.0, 75.5)
  $path.AddBezier(26.0, 75.5, 18.1, 75.0, 17.4, 62.4, 14.8, 55.3)
  $path.AddBezier(14.8, 55.3, 10.8, 44.7, 4.6, 31.1, 7.5, 19.9)
  $path.AddBezier(7.5, 19.9, 10.8, 7.2, 26.8, 1.0, 36.7, 6.4)
  $path.CloseFigure()

  $fill = New-Object System.Drawing.Drawing2D.PathGradientBrush $path
  $fill.CenterColor = C ([int](255 * $Opacity)) 255 253 244
  $fill.SurroundColors = [System.Drawing.Color[]]@(C ([int](245 * $Opacity)) 225 174 79)
  $Graphics.FillPath($fill, $path)
  $fill.Dispose()

  $pen = New-Object System.Drawing.Pen (C ([int](150 * $Opacity)) 255 245 207), 2.3
  $Graphics.DrawPath($pen, $path)
  $pen.Dispose()

  $highlight = New-Object System.Drawing.Drawing2D.GraphicsPath
  $highlight.StartFigure()
  $highlight.AddBezier(22.2, 14.8, 28.2, 10.0, 34.8, 16.0, 36.7, 17.0)
  $highlight.AddBezier(36.7, 17.0, 42.0, 12.8, 50.0, 11.6, 55.0, 16.2)
  $highlightPen = New-Object System.Drawing.Pen (C ([int](165 * $Opacity)) 255 255 255), 3.6
  $highlightPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $highlightPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawPath($highlightPen, $highlight)
  $highlightPen.Dispose()
  $highlight.Dispose()
  $path.Dispose()

  $Graphics.Restore($state)
}

function Draw-StoryLines {
  param([System.Drawing.Graphics]$Graphics, [double]$Opacity)
  $lineBrush = New-Object System.Drawing.SolidBrush (C ([int](190 * $Opacity)) 255 230 154)
  $Graphics.FillRectangle($lineBrush, (New-Object System.Drawing.RectangleF(-45, 45, 90, 4)))
  $Graphics.FillRectangle($lineBrush, (New-Object System.Drawing.RectangleF(-36, 57, 72, 4)))
  $Graphics.FillRectangle($lineBrush, (New-Object System.Drawing.RectangleF(-25, 69, 50, 4)))
  $lineBrush.Dispose()
}

function Draw-StoryCard {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Scale,
    [double]$Rotation,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }
  Draw-Glow $Graphics $CenterX $CenterY (86 * $Scale) (115 * $Scale) (C 255 255 214 112) ($Opacity * 0.72)

  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
  $Graphics.ScaleTransform([single]$Scale, [single]$Scale)

  $rect = New-Object System.Drawing.RectangleF(-68, -94, 136, 188)
  $path = New-RoundedRectPath $rect 17
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    (C ([int](230 * $Opacity)) 76 57 150),
    (C ([int](212 * $Opacity)) 151 119 209),
    [single]70
  )
  $Graphics.FillPath($brush, $path)
  $brush.Dispose()

  $shineBrush = New-Object System.Drawing.SolidBrush (C ([int](58 * $Opacity)) 255 255 255)
  $Graphics.FillEllipse($shineBrush, (New-Object System.Drawing.RectangleF(-42, -83, 84, 70)))
  $shineBrush.Dispose()

  $pen = New-Object System.Drawing.Pen (C ([int](225 * $Opacity)) 255 235 167), 2.5
  $Graphics.DrawPath($pen, $path)
  $pen.Dispose()
  $path.Dispose()

  Draw-Tooth $Graphics 0 -31 44 2 $Opacity

  $textBrush = New-Object System.Drawing.SolidBrush (C ([int](235 * $Opacity)) 255 233 156)
  $stringFormat = New-Object System.Drawing.StringFormat
  $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $Graphics.DrawString('TOOTH STORY', $script:storyFont, $textBrush, (New-Object System.Drawing.RectangleF(-64, 12, 128, 20)), $stringFormat)
  $stringFormat.Dispose()
  $textBrush.Dispose()

  Draw-StoryLines $Graphics $Opacity

  $heart = New-Object System.Drawing.Drawing2D.GraphicsPath
  $heart.AddPolygon([System.Drawing.PointF[]]@(
      (New-Object System.Drawing.PointF(-4, 82)),
      (New-Object System.Drawing.PointF(-18, 69)),
      (New-Object System.Drawing.PointF(-13, 57)),
      (New-Object System.Drawing.PointF(-4, 62)),
      (New-Object System.Drawing.PointF(5, 57)),
      (New-Object System.Drawing.PointF(18, 69)),
      (New-Object System.Drawing.PointF(4, 82))
    ))
  $heartBrush = New-Object System.Drawing.SolidBrush (C ([int](200 * $Opacity)) 255 224 141)
  $Graphics.FillPath($heartBrush, $heart)
  $heartBrush.Dispose()
  $heart.Dispose()

  $Graphics.Restore($state)
}

function Draw-Vault {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$Left,
    [double]$Top,
    [double]$Width,
    [double]$Height,
    [double]$Scale,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }
  $cx = $Left + ($Width / 2)
  $cy = $Top + ($Height / 2)
  Draw-Glow $Graphics $cx $cy ($Width * 0.66 * $Scale) ($Height * 0.58 * $Scale) (C 255 255 211 103) ($Opacity * 0.92)

  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$cx, [single]$cy)
  $Graphics.ScaleTransform([single]$Scale, [single]$Scale)
  $Graphics.TranslateTransform([single](-$Width / 2), [single](-$Height / 2))

  $outer = New-Object System.Drawing.RectangleF(0, 0, [single]$Width, [single]$Height)
  $outerPath = New-RoundedRectPath $outer 52
  $glassBrush = New-Object System.Drawing.SolidBrush (C ([int](72 * $Opacity)) 255 255 255)
  $Graphics.FillPath($glassBrush, $outerPath)
  $glassBrush.Dispose()
  $outerPen = New-Object System.Drawing.Pen (C ([int](230 * $Opacity)) 255 247 214), 4
  $Graphics.DrawPath($outerPen, $outerPath)
  $outerPen.Dispose()
  $outerPath.Dispose()

  $inner = New-Object System.Drawing.RectangleF(15, 16, [single]($Width - 30), [single]($Height - 32))
  $innerPath = New-RoundedRectPath $inner 42
  $innerPen = New-Object System.Drawing.Pen (C ([int](150 * $Opacity)) 152 120 218), 2.4
  $Graphics.DrawPath($innerPen, $innerPath)
  $innerPen.Dispose()
  $innerPath.Dispose()

  $shinePen = New-Object System.Drawing.Pen (C ([int](112 * $Opacity)) 255 255 255), 8
  $Graphics.DrawArc($shinePen, (New-Object System.Drawing.RectangleF(28, 18, [single]($Width - 56), [single]($Height * 0.55))), 205, 88)
  $shinePen.Dispose()

  Draw-StoryCard $Graphics ($Width * 0.45) ($Height * 0.47) 0.78 0 $Opacity

  $lockCx = $Width * 0.79
  $lockCy = $Height * 0.73
  Draw-Glow $Graphics $lockCx $lockCy 34 34 (C 255 255 207 90) ($Opacity * 0.75)
  $lockBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    (New-Object System.Drawing.RectangleF([single]($lockCx - 26), [single]($lockCy - 26), 52, 52)),
    (C ([int](255 * $Opacity)) 255 239 168),
    (C ([int](255 * $Opacity)) 174 103 28),
    [single]55
  )
  $Graphics.FillEllipse($lockBrush, (New-Object System.Drawing.RectangleF([single]($lockCx - 26), [single]($lockCy - 26), 52, 52)))
  $lockBrush.Dispose()

  $keyBrush = New-Object System.Drawing.SolidBrush (C ([int](160 * $Opacity)) 79 45 30)
  $Graphics.FillEllipse($keyBrush, (New-Object System.Drawing.RectangleF([single]($lockCx - 5), [single]($lockCy - 6), 10, 10)))
  $Graphics.FillRectangle($keyBrush, (New-Object System.Drawing.RectangleF([single]($lockCx - 3), [single]($lockCy + 1), 6, 20)))
  $keyBrush.Dispose()

  $Graphics.Restore($state)
}

function Draw-Coin {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Size,
    [double]$Scale,
    [double]$RotateY,
    [double]$Opacity
  )

  if ($Opacity -le 0.001) { return }
  Draw-Glow $Graphics $CenterX $CenterY ($Size * 0.85 * $Scale) ($Size * 0.85 * $Scale) (C 255 255 204 82) ($Opacity * 0.74)
  $squash = 0.38 + (0.62 * [Math]::Abs([Math]::Cos($RotateY * [Math]::PI / 180)))
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.ScaleTransform([single]($Scale * $squash), [single]$Scale)

  $rect = New-Object System.Drawing.RectangleF([single](-$Size / 2), [single](-$Size / 2), [single]$Size, [single]$Size)
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    (C ([int](255 * $Opacity)) 255 241 172),
    (C ([int](255 * $Opacity)) 183 113 33),
    [single]65
  )
  $Graphics.FillEllipse($brush, $rect)
  $brush.Dispose()

  $rimPen = New-Object System.Drawing.Pen (C ([int](155 * $Opacity)) 137 81 20), 4
  $Graphics.DrawEllipse($rimPen, $rect)
  $Graphics.DrawEllipse($rimPen, (New-Object System.Drawing.RectangleF([single](-$Size * 0.36), [single](-$Size * 0.36), [single]($Size * 0.72), [single]($Size * 0.72))))
  $rimPen.Dispose()

  $textBrush = New-Object System.Drawing.SolidBrush (C ([int](205 * $Opacity)) 117 72 17)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $Graphics.DrawString('$', $script:coinFont, $textBrush, $rect, $format)
  $format.Dispose()
  $textBrush.Dispose()

  $Graphics.Restore($state)
}

function Draw-Trail {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(6, 0), @(14, 0.24), @(34, 0.34), @(44, 0.18), @(56, 0), @(100, 0))
  if ($opacity -le 0.001) { return }

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddBezier(
    [single]($Width * -0.02), [single]($Height * 0.27),
    [single]($Width * 0.14), [single]($Height * 0.08),
    [single]($Width * 0.33), [single]($Height * 0.22),
    [single]($Width * 0.48), [single]($Height * 0.50)
  )

  $penGlow = New-Object System.Drawing.Pen (C ([int](66 * $opacity)) 255 219 124), 9
  $penGlow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $penGlow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawPath($penGlow, $path)
  $penGlow.Dispose()

  $pen = New-Object System.Drawing.Pen (C ([int](150 * $opacity)) 255 239 184), 2.8
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawPath($pen, $path)
  $pen.Dispose()
  $path.Dispose()
}

function Draw-Background {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $rect = New-Object System.Drawing.RectangleF(0, 0, [single]$Width, [single]$Height)
  $bg = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    (C 255 255 248 237),
    (C 255 241 232 255),
    [single]135
  )
  $Graphics.FillRectangle($bg, $rect)
  $bg.Dispose()

  $magicGate = SmoothRange 36 78 $Percent
  $ambient = 0.20 + (0.45 * $magicGate) + (0.14 * [Math]::Sin(($Percent / 100) * [Math]::PI))
  Draw-Glow $Graphics ($Width * 0.78) ($Height * 0.16) 205 150 (C 255 252 207 112) (0.18 * $ambient)
  Draw-Glow $Graphics ($Width * 0.17) ($Height * 0.19) 210 160 (C 255 172 134 231) (0.12 * $ambient)
  Draw-Glow $Graphics ($Width * 0.50) ($Height * 0.56) 230 150 (C 255 255 231 162) (0.16 * $ambient)
}

function Draw-PedestalPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(25, 0), @(32, 1), @(55, 1), @(65, 0), @(100, 0))
  if ($opacity -le 0.001) { return }
  $scale = Interp-Key $Percent @(@(0, 0.76), @(25, 0.76), @(32, 1.06), @(55, 1.06), @(65, 0.92), @(100, 0.92))
  $x = $Width * 0.49
  $y = $Height * 0.58
  Draw-ImageOpacity $Graphics $script:keepsake $x $y 350 308 0 $scale $scale $opacity
}

function Draw-TandaPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent, [double]$FrameIndex)
  $state = Get-TandaState $Percent
  $time = $FrameIndex / $Fps
  $float = [Math]::Sin($time * [Math]::PI * 2.2) * 4.5
  $wingBeat = [Math]::Sin($time * [Math]::PI * 9.5)
  $wingIntensity = 0.55 + (0.45 * [Math]::Abs($wingBeat))
  $wingClips = @(
    @(36, 56, 148, 221),
    @(236, 78, 145, 210)
  )

  $x = $state.X
  $y = $state.Y + $float
  $size = $state.Size
  $scale = $state.Scale
  $rot = $state.Rotation
  $baseOpacity = $state.Opacity
  $poseImage = Get-TandaPoseImage $Percent

  $smearGate = (SmoothRange 4 16 $Percent) * (1 - (SmoothRange 20 30 $Percent))
  if ($smearGate -gt 0.001) {
    Draw-ImageOpacity $Graphics $poseImage ($x - 44) ($y + 16) $size $size ($rot - 4) ($scale * 0.98) ($scale * 1.01) ($baseOpacity * $smearGate * 0.075)
  }

  $wingOpacity = $baseOpacity * (0.10 + (0.12 * $wingIntensity))
  $wingScaleX = $scale * (1.04 + (0.045 * [Math]::Abs($wingBeat)))
  $wingScaleY = $scale * (0.98 - (0.018 * [Math]::Abs($wingBeat)))
  $wingRot = $rot + ($wingBeat * 4.5)

  if ($script:tandaWingOverlay -ne $null) {
    Draw-ImageOpacity $Graphics $script:tandaWingOverlay ($x - 2) ($y - 1) $size $size $wingRot $wingScaleX $wingScaleY $wingOpacity
  } elseif (!$script:posePackReady) {
    Draw-ImageOpacityClipped $Graphics $script:tandaWithTooth ($x - 2) ($y - 1) $size $size $wingRot $wingScaleX $wingScaleY ($wingOpacity * $state.WithTooth) $wingClips
    Draw-ImageOpacityClipped $Graphics $script:tandaAfterDrop ($x - 2) ($y - 1) $size $size $wingRot $wingScaleX $wingScaleY ($wingOpacity * $state.AfterDrop) $wingClips
  }

  Draw-Glow $Graphics $x $y (105 * $scale) (95 * $scale) (C 255 255 231 150) ($baseOpacity * 0.18)
  if ($script:posePackReady) {
    $poseLayers = Get-TandaPoseLayers $Percent
    foreach ($poseLayer in $poseLayers) {
      if ($poseLayer.Opacity -gt 0.001) {
        Draw-ImageOpacity $Graphics $poseLayer.Image $x $y $size $size $rot $scale $scale ($baseOpacity * $poseLayer.Opacity)
      }
    }
  } else {
    Draw-ImageOpacity $Graphics $script:tandaWithTooth $x $y $size $size $rot $scale $scale ($baseOpacity * $state.WithTooth)
    Draw-ImageOpacity $Graphics $script:tandaAfterDrop $x $y $size $size $rot $scale $scale ($baseOpacity * $state.AfterDrop)
  }
}

function Draw-ToothJourney {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(36.4, 0), @(38.4, 1), @(48, 0.95), @(54, 0), @(100, 0))
  if ($opacity -le 0.001) { return }

  $state = Get-TandaState $Percent
  $handLocalX = Interp-Key $Percent @(@(0, 760), @(36.4, 820), @(46, 812), @(100, 812))
  $handLocalY = Interp-Key $Percent @(@(0, 350), @(36.4, 560), @(46, 556), @(100, 556))
  $handPoint = Get-TandaPoint $state $handLocalX $handLocalY
  $dropT = SmoothRange 37.2 46 $Percent
  $cardT = SmoothRange 43 54 $Percent

  $dropX = $Width * 0.49
  $dropY = $Height * 0.50
  $storyX = $Width * 0.516
  $storyY = $Height * 0.34

  $holdOffsetX = Interp-Key $Percent @(@(0, 0), @(30, 0), @(36.4, -8), @(43, -10), @(100, -10))
  $holdOffsetY = Interp-Key $Percent @(@(0, 0), @(30, 0), @(36.4, 12), @(43, 14), @(100, 14))
  $x = Lerp (([double]$handPoint[0]) + $holdOffsetX) $dropX $dropT
  $y = (Lerp (([double]$handPoint[1]) + $holdOffsetY) $dropY $dropT) - ([Math]::Sin($dropT * [Math]::PI) * $Height * 0.035)

  if ($Percent -ge 43) {
    $x = Lerp $dropX $storyX $cardT
    $y = (Lerp $dropY $storyY $cardT) - ([Math]::Sin($cardT * [Math]::PI) * $Height * 0.05)
  }

  $rot = Interp-Key $Percent @(@(0, -5), @(39, 0), @(47, 8), @(100, 8))
  $scale = Interp-Key $Percent @(@(0, 0.42), @(36.4, 0.42), @(38.4, 0.58), @(43, 0.88), @(48, 0.46), @(54, 0.12), @(100, 0.12))
  Draw-Tooth $Graphics $x $y (92 * $scale) $rot $opacity
}

function Draw-MemoryCardPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(48, 0), @(58, 1), @(70, 1), @(78, 0), @(100, 0))
  if ($opacity -le 0.001) { return }
  $scale = Interp-Key $Percent @(@(0, 0.52), @(48, 0.52), @(58, 1.14), @(70, 1.10), @(78, 0.98), @(100, 0.98))
  $rot = Interp-Key $Percent @(@(0, -5), @(48, -5), @(58, 1), @(78, 1), @(100, 1))
  $yLift = Interp-Key $Percent @(@(0, 54), @(48, 54), @(58, 0), @(100, 0))
  Draw-StoryCard $Graphics ($Width * 0.50) (($Height * 0.36) + $yLift) $scale $rot $opacity
}

function Draw-VaultPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(62, 0), @(72, 1), @(88, 1), @(100, 0))
  if ($opacity -le 0.001) { return }
  $scale = Interp-Key $Percent @(@(0, 0.78), @(62, 0.78), @(72, 1.08), @(88, 1.08), @(100, 0.96))
  Draw-Vault $Graphics ($Width * 0.38) ($Height * 0.18) 340 368 $scale $opacity
}

function Quad-Lerp {
  param([double]$A, [double]$B, [double]$C, [double]$T)
  return Lerp (Lerp $A $B $T) (Lerp $B $C $T) $T
}

function Draw-GiftPulsePhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(65, 0), @(69, 0.85), @(75, 1), @(81, 0), @(100, 0))
  if ($opacity -le 0.001) { return }

  $t = SmoothRange 65 81 $Percent
  $x = Quad-Lerp ($Width * 0.50) ($Width * 0.53) ($Width * 0.56) $t
  $y = (Quad-Lerp ($Height * 0.35) ($Height * 0.27) ($Height * 0.38) $t)
  $pulse = [Math]::Sin($t * [Math]::PI)
  $size = 24 + (46 * $pulse)

  Draw-Glow $Graphics $x $y ($size * 2.4) ($size * 1.45) (C 255 255 218 92) ($opacity * 0.82)
  Draw-Glow $Graphics ($x - 18) ($y + 12) ($size * 1.35) ($size * 0.86) (C 255 255 249 211) ($opacity * 0.42)
  Draw-Sparkle $Graphics ($x + 8) ($y - 2) (8 + (8 * $pulse)) ($opacity * 0.74)

  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$x, [single]$y)
  $brush = New-Object System.Drawing.SolidBrush (C ([int](185 * $opacity)) 255 235 120)
  $Graphics.FillEllipse($brush, (New-Object System.Drawing.RectangleF([single](-$size * 0.28), [single](-$size * 0.28), [single]($size * 0.56), [single]($size * 0.56))))
  $brush.Dispose()
  $Graphics.Restore($state)
}

function Draw-CoinPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(70, 0), @(74, 1), @(86, 1), @(90, 0.86), @(92, 0), @(100, 0))
  if ($opacity -le 0.001) { return }

  $t = SmoothRange 71 91 $Percent
  $startX = $Width * 0.515
  $startY = $Height * 0.37
  $controlX = $Width * 0.66
  $controlY = $Height * 0.23
  $endX = $Width * 0.797
  $endY = $Height * 0.585

  $arcPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $samples = 18
  $prevX = $startX
  $prevY = $startY
  for ($i = 1; $i -le $samples; $i++) {
    $sampleT = $t * ($i / $samples)
    $sampleX = Quad-Lerp $startX $controlX $endX $sampleT
    $sampleY = Quad-Lerp $startY $controlY $endY $sampleT
    $arcPath.AddLine([single]$prevX, [single]$prevY, [single]$sampleX, [single]$sampleY)
    $prevX = $sampleX
    $prevY = $sampleY
  }
  if ($t -gt 0.05) {
    $arcOpacity = $opacity * (0.16 + (0.28 * [Math]::Sin($t * [Math]::PI)))
    $arcGlow = New-Object System.Drawing.Pen (C ([int](128 * $arcOpacity)) 255 224 95), 16
    $arcGlow.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arcGlow.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $Graphics.DrawPath($arcGlow, $arcPath)
    $arcGlow.Dispose()

    $arcCore = New-Object System.Drawing.Pen (C ([int](178 * $arcOpacity)) 255 245 183), 3.6
    $arcCore.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arcCore.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $Graphics.DrawPath($arcCore, $arcPath)
    $arcCore.Dispose()
  }
  $arcPath.Dispose()

  foreach ($lag in @(0.06, 0.13, 0.22)) {
    if ($t -gt $lag) {
      $trailT = Clamp01 ($t - $lag)
      $trailX = Quad-Lerp $startX $controlX $endX $trailT
      $trailY = Quad-Lerp $startY $controlY $endY $trailT
      $trailOpacity = $opacity * (0.20 - ($lag * 0.50))
      Draw-Glow $Graphics $trailX $trailY (78 - (120 * $lag)) (42 - (48 * $lag)) (C 255 255 218 95) $trailOpacity
    }
  }

  $x = Quad-Lerp $startX $controlX $endX $t
  $y = Quad-Lerp $startY $controlY $endY $t
  $scale = Interp-Key $Percent @(@(0, 0.35), @(70, 0.35), @(75, 0.74), @(83, 0.96), @(88, 0.62), @(91, 0.14), @(100, 0.14))
  $rotY = Interp-Key $Percent @(@(0, 0), @(70, 0), @(76, 130), @(83, 310), @(88, 500), @(91, 660), @(100, 660))
  Draw-Glow $Graphics ($x - 28) ($y + 22) 88 45 (C 255 255 221 125) ($opacity * 0.34)
  Draw-Coin $Graphics $x $y 72 $scale $rotY $opacity
}

function Draw-PiggyPhase {
  param([System.Drawing.Graphics]$Graphics, [double]$Percent)
  $opacity = Interp-Key $Percent @(@(0, 0), @(72, 0), @(78, 1), @(96, 1), @(100, 0))
  $slotWake = Interp-Key $Percent @(@(0, 0), @(75, 0), @(82, 0.72), @(87, 0.95), @(94, 0.30), @(100, 0))
  $impactGlow = Interp-Key $Percent @(@(0, 0), @(86, 0), @(90, 1), @(96, 0.70), @(100, 0))
  $baseW = 414
  $baseH = 360
  $baseX = $Width - ($Width * 0.06) - $baseW
  $baseY = $Height - ($Height * 0.10) - $baseH
  $tx = Interp-Key $Percent @(@(0, 12), @(68, 12), @(75, 0), @(88, 0), @(91, -1), @(95, 0), @(100, 5))
  $ty = Interp-Key $Percent @(@(0, 4), @(68, 4), @(75, 0), @(86, 0), @(90, -7), @(94, 1), @(100, 1))
  $scale = Interp-Key $Percent @(@(0, 0.88), @(68, 0.88), @(75, 1), @(87, 1), @(90, 1.07), @(94, 1.01), @(100, 0.96))
  $cx = $baseX + ($baseW / 2) + (($tx / 100) * $baseW)
  $cy = $baseY + ($baseH / 2) + (($ty / 100) * $baseH)
  $slotX = $cx + (2 * $scale)
  $slotY = $cy - (94 * $scale)

  Draw-Glow $Graphics ($cx + 8) ($cy + 6) 255 190 (C 255 255 214 105) ($impactGlow * 0.95)
  Draw-Glow $Graphics $slotX $slotY 118 54 (C 255 255 224 126) (($slotWake * 0.74) + ($impactGlow * 0.40))
  if ($impactGlow -gt 0.001) {
    Draw-Glow $Graphics ($cx + 2) ($cy - 46) 310 210 (C 255 255 217 105) ($impactGlow * 0.44)
  }
  Draw-ImageOpacity $Graphics $script:piggy $cx $cy $baseW $baseH 0 $scale $scale $opacity

  if ($slotWake -gt 0.001) {
    Draw-Sparkle $Graphics $slotX ($slotY - 4) 8 (($slotWake * 0.32) + ($impactGlow * 0.30))
  }
  if ($impactGlow -gt 0.001) {
    Draw-Sparkle $Graphics ($cx + 54) ($cy - 126) 12 ($impactGlow * 0.54)
    Draw-Sparkle $Graphics ($cx - 78) ($cy - 68) 8 ($impactGlow * 0.38)
  }
}

function Draw-SparkleField {
  param([System.Drawing.Graphics]$Graphics, [double]$FrameIndex)
  $points = @(
    @(0.12, 0.22, 0.1), @(0.18, 0.68, 1.1), @(0.28, 0.16, 0.7), @(0.35, 0.76, 1.7),
    @(0.42, 0.29, 1.3), @(0.49, 0.59, 0.3), @(0.55, 0.20, 2.1), @(0.63, 0.72, 0.9),
    @(0.70, 0.26, 1.9), @(0.82, 0.16, 0.5), @(0.88, 0.68, 1.5), @(0.78, 0.78, 2.6),
    @(0.24, 0.49, 2.3), @(0.58, 0.44, 2.7), @(0.67, 0.52, 0.2), @(0.91, 0.36, 2.4),
    @(0.06, 0.48, 1.8), @(0.31, 0.38, 0.8), @(0.73, 0.41, 1.2), @(0.47, 0.11, 2.0),
    @(0.14, 0.84, 2.8), @(0.51, 0.84, 1.4), @(0.84, 0.49, 0.6), @(0.38, 0.13, 2.2)
  )
  $percent = ($FrameIndex / ($Frames - 1)) * 100
  if ($percent -lt 43) { return }
  $fieldGate = SmoothRange 43 58 $percent
  $time = $FrameIndex / $Fps
  foreach ($p in $points) {
    $focusDim = 1 - (0.62 * (SmoothRange 72 80 $percent) * (1 - (SmoothRange 94 100 $percent)))
    $phase = (($time + [double]$p[2]) % 2.9) / 2.9
    $alpha = if ($phase -lt 0.42) {
      SmoothRange 0 0.42 $phase
    } elseif ($phase -lt 0.70) {
      Lerp 0.9 0.28 (SmoothRange 0.42 0.70 $phase)
    } else {
      Lerp 0.28 0 (SmoothRange 0.70 1 $phase)
    }
    Draw-Sparkle $Graphics ($Width * [double]$p[0]) ($Height * [double]$p[1]) 6 ($alpha * 0.34 * $fieldGate * $focusDim)
  }

  $storyPulse = SmoothRange 48 62 $percent
  $giftPulse = SmoothRange 88 94 $percent
  Draw-Sparkle $Graphics ($Width * 0.47) ($Height * 0.35) 13 ($storyPulse * 0.62)
  Draw-Sparkle $Graphics ($Width * 0.82) ($Height * 0.39) 12 ($giftPulse * 0.72)
}

try {
  for ($frame = 0; $frame -lt $Frames; $frame++) {
    $percent = ($frame / ($Frames - 1)) * 100
    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    Draw-Background $graphics $percent
    Draw-Trail $graphics $percent
    Draw-PedestalPhase $graphics $percent
    Draw-ToothJourney $graphics $percent
    Draw-MemoryCardPhase $graphics $percent
    Draw-VaultPhase $graphics $percent
    Draw-GiftPulsePhase $graphics $percent
    Draw-PiggyPhase $graphics $percent
    Draw-TandaPhase $graphics $percent $frame
    Draw-CoinPhase $graphics $percent
    Draw-SparkleField $graphics $frame

    $framePath = Join-Path $framesDir ('frame_{0:D4}.png' -f $frame)
    $bitmap.Save($framePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()

    if (($frame % 24) -eq 0) {
      Write-Host ("Rendered frame {0}/{1}" -f $frame, $Frames)
    }
  }

  $mp4Out = Join-Path $publicDir 'tfn-tanda-hero-layered-loop.mp4'
  $webmOut = Join-Path $publicDir 'tfn-tanda-hero-layered-loop.webm'
  $posterOut = Join-Path $publicDir 'tfn-tanda-hero-layered-poster.webp'
  $posterFrame = Join-Path $framesDir ('frame_{0:D4}.png' -f ([Math]::Min($Frames - 1, [Math]::Round($Frames * 0.90))))
  $inputPattern = Join-Path $framesDir 'frame_%04d.png'

  & $FfmpegPath -y -framerate $Fps -i $inputPattern -c:v libx264 -pix_fmt yuv420p -movflags +faststart -crf 21 -preset medium $mp4Out
  & $FfmpegPath -y -framerate $Fps -i $inputPattern -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 3 $webmOut
  & $FfmpegPath -y -i $posterFrame -frames:v 1 -compression_level 6 -quality 82 $posterOut

  Write-Host "Wrote $mp4Out"
  Write-Host "Wrote $webmOut"
  Write-Host "Wrote $posterOut"
  Write-Host "Frames: $framesDir"
} finally {
  $storyFont.Dispose()
  $coinFont.Dispose()
  $fontFamily.Dispose()
  $tandaWithTooth.Dispose()
  $tandaAfterDrop.Dispose()
  $tandaPoseFly.Dispose()
  $tandaPoseHover.Dispose()
  $tandaPoseDrop.Dispose()
  $tandaPoseReach.Dispose()
  $tandaPoseRetract.Dispose()
  $tandaPoseFollow.Dispose()
  $tandaPoseGuide.Dispose()
  $tandaPoseGuideDown.Dispose()
  $tandaPosePigCelebrate.Dispose()
  $tandaPoseCelebrate.Dispose()
  if ($tandaWingOverlay -ne $null) {
    $tandaWingOverlay.Dispose()
  }
  $piggy.Dispose()
  $keepsake.Dispose()
}
