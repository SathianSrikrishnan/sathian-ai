param(
  [int]$Width = 1280,
  [int]$Height = 800,
  [int]$Fps = 30,
  [int]$Frames = 600,
  [int]$OnlyFrame = -1,
  [string]$OutputRoot = '',
  [string]$FfmpegPath = ''
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
  $OutputRoot = Join-Path $repoRoot ('.tmp\tanda-hero-integrated-render-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
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

$visualRoot = Join-Path $repoRoot 'public\toothfairy'
$animationRoot = Join-Path $visualRoot 'animation'
$poseV21Root = Join-Path $animationRoot 'hero-pose-pack-v21'
$poseV22Root = Join-Path $animationRoot 'hero-pose-pack-v22-pre'

$family = [System.Drawing.Image]::FromFile((Join-Path $visualRoot 'visual-system\hero-family-v1.png'))
$base = [System.Drawing.Image]::FromFile((Join-Path $animationRoot 'base-options\capture-base-a-platform-cropped.png'))
$pig = [System.Drawing.Image]::FromFile((Join-Path $animationRoot 'layered\piggy-cutout-soft-no-coin.png'))

$prePoseNames = @(
  '01-entry-no-tooth-wing-up',
  '02-entry-no-tooth-wing-down',
  '03-searching',
  '04-spots-tooth',
  '05-reach-empty-hand',
  '06-grab-tooth',
  '07-lift-tooth-close',
  '08-carry-tooth-glow'
)

$ritualPoseNames = @(
  '01-entry-wing-up',
  '02-entry-wing-down',
  '03-brake-near-photo',
  '04-phone-emerging',
  '05-phone-ready',
  '06-place-tooth',
  '07-photo-flash-empty-hand',
  '08-magic-pause',
  '09-two-hand-photo',
  '10-phone-tap',
  '11-two-thumb-type',
  '12-capture-complete',
  '13-notices-coin',
  '14-pickup-coin',
  '15-carry-coin',
  '16-release-coin',
  '17-empty-hand-after-release',
  '18-pig-glow-reaction',
  '19-turn-front',
  '20-wave-start',
  '21-wave-open',
  '22-wave-finish',
  '23-exit-wing-up',
  '24-exit-wing-down'
)

$poseImages = @()
foreach ($poseName in $prePoseNames) {
  $poseImages += [System.Drawing.Image]::FromFile((Join-Path $poseV22Root "tanda-hero-v22-pre-$poseName.png"))
}
foreach ($poseName in $ritualPoseNames) {
  $poseImages += [System.Drawing.Image]::FromFile((Join-Path $poseV21Root "tanda-hero-v21-$poseName.png"))
}

$poseCues = @(
  @(0.000, 0), @(0.145, 0), @(0.180, 1),
  @(0.214, 3), @(0.248, 4), @(0.275, 5), @(0.305, 6),
  @(0.360, 6), @(0.430, 6), @(0.490, 11), @(0.550, 12),
  @(0.610, 16), @(0.660, 18),
  @(0.715, 25), @(0.760, 25), @(0.815, 25), @(0.865, 25),
  @(0.905, 25), @(0.930, 25), @(0.955, 25), @(0.970, 26),
  @(0.982, 27), @(0.990, 28), @(0.996, 29), @(0.999, 31)
)

$fontFamily = New-Object System.Drawing.FontFamily 'Segoe UI'
$serifFamily = New-Object System.Drawing.FontFamily 'Georgia'
$labelFont = New-Object System.Drawing.Font $fontFamily, 13, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$smallFont = New-Object System.Drawing.Font $fontFamily, 15, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$amountFont = New-Object System.Drawing.Font $serifFamily, 32, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$savedFont = New-Object System.Drawing.Font $serifFamily, 26, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$coinFont = New-Object System.Drawing.Font $serifFamily, 30, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

function C {
  param([int]$Alpha, [int]$Red, [int]$Green, [int]$Blue)
  return [System.Drawing.Color]::FromArgb($Alpha, $Red, $Green, $Blue)
}

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

function HoldFade {
  param(
    [double]$Value,
    [double]$EnterStart,
    [double]$EnterEnd,
    [double]$ExitStart,
    [double]$ExitEnd
  )
  $enter = SmoothRange $EnterStart $EnterEnd $Value
  $exit = 1 - (SmoothRange $ExitStart $ExitEnd $Value)
  return Clamp01 ([Math]::Min($enter, $exit))
}

function Lerp {
  param([double]$A, [double]$B, [double]$T)
  return $A + (($B - $A) * $T)
}

function Bezier3 {
  param(
    [double]$A,
    [double]$B,
    [double]$C,
    [double]$D,
    [double]$T
  )
  $t = Clamp01 $T
  $u = 1 - $t
  return (($u * $u * $u) * $A) + (3 * ($u * $u) * $t * $B) + (3 * $u * ($t * $t) * $C) + (($t * $t * $t) * $D)
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
    [double]$Opacity
  )
  if ($Opacity -le 0.001) { return }

  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
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

function Draw-CoverImageRounded {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Image]$Image,
    [System.Drawing.RectangleF]$Rect,
    [double]$Radius
  )
  $path = New-RoundedRectPath $Rect $Radius
  $state = $Graphics.Save()
  $Graphics.SetClip($path)

  $scale = [Math]::Max($Rect.Width / $Image.Width, $Rect.Height / $Image.Height)
  $drawW = $Image.Width * $scale
  $drawH = $Image.Height * $scale
  $drawX = $Rect.X + (($Rect.Width - $drawW) / 2)
  $drawY = $Rect.Y + (($Rect.Height - $drawH) / 2)
  $Graphics.DrawImage($Image, (New-Object System.Drawing.RectangleF([single]$drawX, [single]$drawY, [single]$drawW, [single]$drawH)))

  $wash = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $Rect, (C 205 251 247 238), (C 0 251 247 238), ([System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
  $Graphics.FillRectangle($wash, $Rect)
  $wash.Dispose()
  Draw-Glow $Graphics ($Rect.X + 135) ($Rect.Y + 85) 230 190 (C 255 255 252 246) 0.6

  $Graphics.Restore($state)
  $borderPen = New-Object System.Drawing.Pen (C 185 255 255 255), 1
  $Graphics.DrawPath($borderPen, $path)
  $borderPen.Dispose()
  $path.Dispose()
}

function Draw-Tooth {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Scale,
    [double]$Opacity
  )
  if ($Opacity -le 0.001) { return }
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.ScaleTransform([single]$Scale, [single]$Scale)
  $Graphics.TranslateTransform(-32, -38)

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.StartFigure()
  $path.AddBezier(32, 5.5, 22, 1.5, 13.4, 9, 12.5, 23.6)
  $path.AddBezier(12.5, 23.6, 11.8, 31, 14.3, 37, 16.4, 43.5)
  $path.AddBezier(16.4, 43.5, 18.6, 50, 18.7, 66, 25.7, 68)
  $path.AddBezier(25.7, 68, 30, 69, 30.2, 52, 32, 50)
  $path.AddBezier(32, 50, 33.8, 52, 34, 69, 38.4, 68)
  $path.AddBezier(38.4, 68, 45.4, 66, 45.4, 50, 47.6, 43.5)
  $path.AddBezier(47.6, 43.5, 49.7, 37, 52.2, 31, 51.5, 23.6)
  $path.AddBezier(51.5, 23.6, 50.5, 9, 42, 1.5, 32, 5.5)
  $path.CloseFigure()

  $toothRect = New-Object System.Drawing.RectangleF(10, 4, 44, 66)
  $fill = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $toothRect, (C ([int](255 * $Opacity)) 255 254 250), (C ([int](255 * $Opacity)) 234 209 168), ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $stroke = New-Object System.Drawing.Pen (C ([int](215 * $Opacity)) 216 189 147), 2.3
  $Graphics.FillPath($fill, $path)
  $Graphics.DrawPath($stroke, $path)

  $linePen = New-Object System.Drawing.Pen (C ([int](180 * $Opacity)) 239 222 196), 2
  $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawBezier($linePen, 21, 25.5, 27, 28.2, 37, 28.2, 43.2, 25.5)

  $linePen.Dispose()
  $stroke.Dispose()
  $fill.Dispose()
  $path.Dispose()
  $Graphics.Restore($state)
}

function Draw-ToothMarker {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Radius,
    [double]$Opacity,
    [double]$Scale
  )
  if ($Opacity -le 0.001) { return }
  Draw-Glow $Graphics $CenterX $CenterY ($Radius * 2.2) ($Radius * 2.2) (C 255 216 164 60) ($Opacity * 0.58)
  Draw-Tooth $Graphics $CenterX $CenterY ($Radius * $Scale / 38) $Opacity
}

function Draw-RoundedCard {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.RectangleF]$Rect,
    [double]$Radius,
    [double]$Opacity
  )
  if ($Opacity -le 0.001) { return $null }
  $path = New-RoundedRectPath $Rect $Radius
  $brush = New-Object System.Drawing.SolidBrush (C ([int](238 * $Opacity)) 255 252 246)
  $pen = New-Object System.Drawing.Pen (C ([int](210 * $Opacity)) 227 217 196), 1
  $Graphics.FillPath($brush, $path)
  $Graphics.DrawPath($pen, $path)
  $brush.Dispose()
  $pen.Dispose()
  return $path
}

function Draw-MemoryCard {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $opacity = HoldFade $P 0.952 0.982 0.997 1
  if ($opacity -le 0.001) { return }
  $y = Interp-Key $P @(@(0.952, 46), @(0.982, 0), @(0.994, -4), @(1.0, 8))
  $scale = Interp-Key $P @(@(0.952, 0.72), @(0.982, 1.0), @(1.0, 0.98))
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single](84 + 240 / 2), [single](138 + 148 + $y))
  $Graphics.ScaleTransform([single]$scale, [single]$scale)
  $Graphics.TranslateTransform([single](-84 - 240 / 2), [single](-138 - 148))

  Draw-Glow $Graphics 960 250 140 110 (C 255 244 200 101) ($opacity * 0.24)
  $rect = New-Object System.Drawing.RectangleF 956, 138, 240, 294
  $cardPath = Draw-RoundedCard $Graphics $rect 8 $opacity
  $artRect = New-Object System.Drawing.RectangleF 970, 152, 212, 196
  $artPath = New-RoundedRectPath $artRect 6
  $artBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $artRect, (C ([int](235 * $opacity)) 242 230 255), (C ([int](235 * $opacity)) 255 252 246), ([System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  $Graphics.FillPath($artBrush, $artPath)
  Draw-Glow $Graphics 1076 235 78 62 (C 255 255 232 154) ($opacity * 0.66)
  Draw-Tooth $Graphics 1076 244 0.9 $opacity

  $textBrush = New-Object System.Drawing.SolidBrush (C ([int](255 * $opacity)) 104 113 136)
  $strongBrush = New-Object System.Drawing.SolidBrush (C ([int](255 * $opacity)) 17 35 74)
  $Graphics.DrawString('LIVE MEMORY', $script:labelFont, $textBrush, 970, 364)
  $Graphics.DrawString('Saved', $script:savedFont, $strongBrush, 970, 390)

  $textBrush.Dispose()
  $strongBrush.Dispose()
  $artBrush.Dispose()
  $artPath.Dispose()
  if ($cardPath -ne $null) { $cardPath.Dispose() }
  $Graphics.Restore($state)
}

function Draw-SmileFundCard {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $opacity = HoldFade $P 0.958 0.986 0.997 1
  if ($opacity -le 0.001) { return }
  $y = Interp-Key $P @(@(0.958, 56), @(0.986, 0), @(0.995, -5), @(1.0, 7))
  $scale = Interp-Key $P @(@(0.958, 0.72), @(0.986, 1.0), @(1.0, 0.985))
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single](642 + 470 / 2), [single](606 + $y))
  $Graphics.ScaleTransform([single]$scale, [single]$scale)
  $Graphics.TranslateTransform([single](-642 - 470 / 2), -606)

  Draw-Glow $Graphics 840 624 280 130 (C 255 244 200 101) ($opacity * 0.16)
  $rect = New-Object System.Drawing.RectangleF 642, 524, 470, 142
  $cardPath = Draw-RoundedCard $Graphics $rect 8 $opacity

  $muted = New-Object System.Drawing.SolidBrush (C ([int](255 * $opacity)) 128 136 156)
  $ink = New-Object System.Drawing.SolidBrush (C ([int](255 * $opacity)) 17 35 74)
  $softText = New-Object System.Drawing.SolidBrush (C ([int](255 * $opacity)) 154 161 177)
  $Graphics.DrawString('LITTLE SMILE FUND', $script:labelFont, $muted, 660, 550)
  $Graphics.DrawString('$360', $script:amountFont, $ink, 660, 578)
  $Graphics.DrawString('6 family gifts saved', $script:smallFont, $softText, 660, 618)

  $chartRect = New-Object System.Drawing.RectangleF 838, 542, 252, 104
  $chartPath = Draw-RoundedCard $Graphics $chartRect 8 ($opacity * 0.9)
  $barGradientRect = New-Object System.Drawing.RectangleF 856, 562, 212, 68
  $barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $barGradientRect, (C ([int](255 * $opacity)) 95 208 180), (C ([int](80 * $opacity)) 95 208 180), ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $heights = @(24, 34, 43, 58, 70)
  for ($i = 0; $i -lt $heights.Count; $i++) {
    $barRect = New-Object System.Drawing.RectangleF ([single](858 + ($i * 42)), [single](630 - $heights[$i]), 28, ([single]$heights[$i]))
    $barPath = New-RoundedRectPath $barRect 14
    $Graphics.FillPath($barBrush, $barPath)
    $barPath.Dispose()
  }

  $barBrush.Dispose()
  if ($chartPath -ne $null) { $chartPath.Dispose() }
  $muted.Dispose()
  $ink.Dispose()
  $softText.Dispose()
  if ($cardPath -ne $null) { $cardPath.Dispose() }
  $Graphics.Restore($state)
}

function Draw-Coin {
  param(
    [System.Drawing.Graphics]$Graphics,
    [double]$CenterX,
    [double]$CenterY,
    [double]$Scale,
    [double]$Rotation,
    [double]$Opacity
  )
  if ($Opacity -le 0.001) { return }
  $state = $Graphics.Save()
  $Graphics.TranslateTransform([single]$CenterX, [single]$CenterY)
  $Graphics.RotateTransform([single]$Rotation)
  $Graphics.ScaleTransform([single]$Scale, [single]$Scale)
  $rect = New-Object System.Drawing.RectangleF -29, -29, 58, 58
  $fill = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $rect, (C ([int](255 * $Opacity)) 255 240 169), (C ([int](255 * $Opacity)) 166 100 32), ([System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
  $pen = New-Object System.Drawing.Pen (C ([int](160 * $Opacity)) 133 78 19), 4
  $Graphics.FillEllipse($fill, $rect)
  $Graphics.DrawEllipse($pen, $rect)

  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $brush = New-Object System.Drawing.SolidBrush (C ([int](230 * $Opacity)) 135 83 29)
  $Graphics.DrawString('$', $script:coinFont, $brush, $rect, $format)

  $brush.Dispose()
  $format.Dispose()
  $pen.Dispose()
  $fill.Dispose()
  $Graphics.Restore($state)
}

function Get-TandaMotion {
  param([double]$P)
  if ($P -lt 0.255) {
    $t = Clamp01 (($P - 0.015) / 0.240)
    $x = Bezier3 -280 -118 104 228 $t
    $y = Bezier3 142 78 98 184 $t
  } elseif ($P -lt 0.340) {
    $t = SmoothRange 0.255 0.340 $P
    $x = Lerp 228 238 $t
    $y = 184 + ([Math]::Sin($t * [Math]::PI) * -8)
  } elseif ($P -lt 0.430) {
    $t = SmoothRange 0.340 0.430 $P
    $x = Bezier3 238 270 284 292 $t
    $y = Bezier3 184 246 338 398 $t
  } elseif ($P -lt 0.755) {
    $t = SmoothRange 0.430 0.755 $P
    $x = Bezier3 292 278 304 336 $t
    $y = Bezier3 398 388 382 388 $t
  } elseif ($P -lt 0.935) {
    $t = SmoothRange 0.755 0.935 $P
    $x = Bezier3 336 470 694 902 $t
    $y = Bezier3 388 330 378 386 $t
  } elseif ($P -lt 0.982) {
    $t = SmoothRange 0.935 0.982 $P
    $x = Lerp 902 930 $t
    $y = Lerp 386 332 $t
  } else {
    $t = SmoothRange 0.982 1.0 $P
    $x = Bezier3 930 1018 1124 1220 $t
    $y = Bezier3 332 250 190 132 $t
  }

  $scale = Interp-Key $P @(@(0.00, 0.55), @(0.212, 0.68), @(0.340, 0.70), @(0.640, 0.67), @(0.835, 0.64), @(0.935, 0.66), @(1.00, 0.52))
  $rotation = Interp-Key $P @(@(0.00, -7), @(0.168, -2), @(0.255, 3), @(0.430, -1), @(0.640, 1), @(0.755, -2), @(0.935, 4), @(0.975, -1), @(1.00, -8))
  $opacity = HoldFade $P 0.015 0.08 0.985 1
  $x += [Math]::Cos($P * 9.4247779608) * 1.6
  $y += [Math]::Sin($P * 15.7079632679) * 3.2
  $rotation += [Math]::Sin($P * 18.8495559215) * 0.55
  $size = 330 * $scale
  return @{
    X = $x
    Y = $y
    Scale = $scale
    Rotation = $rotation
    Opacity = $opacity
    Size = $size
    Cx = $x + ($size / 2)
    Cy = $y + ($size / 2)
  }
}

function Draw-Tanda {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $motion = Get-TandaMotion $P
  $x = [double]$motion.X
  $y = [double]$motion.Y
  $scale = [double]$motion.Scale
  $rotation = [double]$motion.Rotation
  $opacity = [double]$motion.Opacity
  if ($opacity -le 0.001) { return }

  $currentIndex = 0
  for ($i = 0; $i -lt $script:poseCues.Count; $i++) {
    if ($P -ge [double]$script:poseCues[$i][0]) {
      $currentIndex = $i
    }
  }
  $nextIndex = [Math]::Min($currentIndex + 1, $script:poseCues.Count - 1)
  $currentCue = $script:poseCues[$currentIndex]
  $nextCue = $script:poseCues[$nextIndex]
  $span = [Math]::Max(0.001, [double]$nextCue[0] - [double]$currentCue[0])
  $local = Clamp01 (($P - [double]$currentCue[0]) / $span)
  $blend = Smooth01 (($local - 0.10) / 0.90)
  $currentPose = $script:poseImages[[int]$currentCue[1]]
  $nextPose = $script:poseImages[[int]$nextCue[1]]

  $size = 330 * $scale
  $cx = $x + ($size / 2)
  $cy = $y + ($size / 2)
  $wingGlow = ((HoldFade $P 0.560 0.690 0.800 0.890) * 0.78) + ((HoldFade $P 0.890 0.970 0.998 1) * 0.68)
  Draw-Glow $Graphics $cx $cy (160 * $scale) (135 * $scale) (C 255 255 232 150) ($wingGlow * $opacity)
  Draw-ImageOpacity $Graphics $currentPose $cx $cy $size $size $rotation ($opacity * (1 - $blend))
  Draw-ImageOpacity $Graphics $nextPose $cx $cy $size $size $rotation ($opacity * $blend)
}

function Draw-HeroToothOverlay {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $opacity = HoldFade $P 0.470 0.540 0.792 0.842
  if ($opacity -le 0.001) { return }

  $motion = Get-TandaMotion $P
  $size = [double]$motion.Size
  $scale = [double]$motion.Scale
  $toothX = [double]$motion.X + ($size * 0.665)
  $toothY = [double]$motion.Y + ($size * 0.430)
  $settle = SmoothRange 0.730 0.810 $P
  $toothX = Lerp $toothX ([double]$motion.X + ($size * 0.585)) $settle
  $toothY = Lerp $toothY ([double]$motion.Y + ($size * 0.515)) $settle
  $toothScale = Interp-Key $P @(@(0.470, 0.24), @(0.560, 0.34), @(0.760, 0.32), @(0.842, 0.18))

  Draw-Glow $Graphics $toothX $toothY (52 * $scale) (42 * $scale) (C 255 255 232 150) ($opacity * 0.62)
  Draw-Tooth $Graphics $toothX $toothY $toothScale $opacity
}

function Draw-HeroCoinOverlay {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $holdOpacity = HoldFade $P 0.682 0.760 0.925 0.946
  $dropOpacity = HoldFade $P 0.925 0.940 0.954 0.964
  $opacity = Clamp01 ([Math]::Max($holdOpacity, $dropOpacity))
  if ($opacity -le 0.001) { return }

  $motion = Get-TandaMotion $P
  $size = [double]$motion.Size
  $scale = [double]$motion.Scale
  $preX = [double]$motion.X + ($size * 0.550)
  $preY = [double]$motion.Y + ($size * 0.490)
  $carryX = [double]$motion.X + ($size * 0.550)
  $carryY = [double]$motion.Y + ($size * 0.490)
  $carryBlend = SmoothRange 0.855 0.915 $P
  $handX = Lerp $preX $carryX $carryBlend
  $handY = Lerp $preY $carryY $carryBlend
  $slotX = 1148
  $slotY = 528

  if ($P -ge 0.925) {
    $drop = SmoothRange 0.925 0.950 $P
    $coinX = Bezier3 $handX 1048 1128 $slotX $drop
    $coinY = Bezier3 $handY 444 498 $slotY $drop
  } else {
    $coinX = $handX
    $coinY = $handY
  }

  $coinScale = Interp-Key $P @(@(0.682, 0.18), @(0.760, 0.98), @(0.915, 0.88), @(0.950, 0.56), @(0.964, 0.18))
  $rotation = Interp-Key $P @(@(0.682, -14), @(0.890, 5), @(0.950, 82), @(0.990, 92))
  $coinBirth = HoldFade $P 0.680 0.760 0.800 0.860
  Draw-Glow $Graphics $coinX $coinY (122 * $scale) (96 * $scale) (C 255 255 241 178) ($coinBirth * 0.74)
  Draw-Glow $Graphics $coinX $coinY (78 * $scale) (58 * $scale) (C 255 255 220 103) (($opacity * 0.76) + ($coinBirth * 0.28))
  Draw-Coin $Graphics $coinX $coinY $coinScale $rotation $opacity
}

function Draw-PigSlotGlow {
  param([System.Drawing.Graphics]$Graphics, [double]$P, [double]$PigY)
  $opacity = HoldFade $P 0.900 0.955 0.992 1
  if ($opacity -le 0.001) { return }
  $rect = New-Object System.Drawing.RectangleF 1123, ([single](516 + $PigY)), 56, 22
  $fill = New-Object System.Drawing.SolidBrush (C ([int](116 * $opacity)) 255 220 103)
  $pen = New-Object System.Drawing.Pen (C ([int](190 * $opacity)) 255 240 169), 3
  $Graphics.FillEllipse($fill, $rect)
  $Graphics.DrawEllipse($pen, $rect)
  $pen.Dispose()
  $fill.Dispose()
}

function Draw-Sparkles {
  param([System.Drawing.Graphics]$Graphics, [double]$P)
  $burst = [Math]::Max((HoldFade $P 0.48 0.56 0.66 0.72), [Math]::Max((HoldFade $P 0.68 0.76 0.84 0.89), ((HoldFade $P 0.86 0.90 0.98 1) * 0.8)))
  $points = @(
    @(225, 290, 0.00), @(315, 535, 0.17), @(410, 614, 0.31), @(580, 372, 0.47),
    @(700, 620, 0.62), @(900, 250, 0.21), @(1000, 555, 0.74), @(1110, 425, 0.38)
  )
  foreach ($point in $points) {
    $local = (($P + [double]$point[2]) % 0.34) / 0.34
    $twinkle = if ($local -lt 0.44) { $local / 0.44 } else { (1 - $local) / 0.56 }
    $opacity = 0.18 + ($burst * 0.58) + ($twinkle * 0.22)
    $scale = 0.55 + ($burst * 0.65) + ($twinkle * 0.28)
    $state = $Graphics.Save()
    $Graphics.TranslateTransform([single]$point[0], [single]$point[1])
    $Graphics.RotateTransform(45)
    $brush = New-Object System.Drawing.SolidBrush (C ([int](255 * (Clamp01 $opacity))) 255 241 167)
    $rect = New-Object System.Drawing.RectangleF ([single](-4 * $scale), ([single](-4 * $scale)), ([single](8 * $scale)), ([single](8 * $scale)))
    $Graphics.FillRectangle($brush, $rect)
    $brush.Dispose()
    $Graphics.Restore($state)
  }
}

function Render-Frame {
  param([int]$FrameIndex)
  $p = if ($Frames -le 1) { 0 } else { $FrameIndex / ($Frames - 1) }
  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bgRect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList $bgRect, (C 255 251 247 238), (C 255 245 239 226), ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $graphics.FillRectangle($bg, $bgRect)
  $bg.Dispose()
  Draw-Glow $graphics 1110 55 310 280 (C 255 216 164 60) 0.22
  Draw-Glow $graphics 115 35 330 280 (C 255 112 72 173) 0.13
  Draw-Glow $graphics 565 430 360 300 (C 255 255 230 152) (0.18 + ([Math]::Sin($p * 6.28318) * 0.04))

  $goldPen = New-Object System.Drawing.Pen (C 64 216 164 60), 2
  $purplePen = New-Object System.Drawing.Pen (C 32 112 72 173), 2
  $goldPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $goldPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $purplePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $purplePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawBezier($goldPen, -110, 610, 165, 472, 340, 475, 528, 362)
  $graphics.DrawBezier($goldPen, 528, 362, 700, 260, 884, 170, 1370, 232)
  $graphics.DrawBezier($purplePen, -40, 680, 180, 548, 408, 584, 620, 454)
  $graphics.DrawBezier($purplePen, 620, 454, 770, 360, 964, 310, 1300, 348)
  $goldPen.Dispose()
  $purplePen.Dispose()

  $familyRect = New-Object System.Drawing.RectangleF 286, 70, 858, 560
  Draw-CoverImageRounded $graphics $family $familyRect 8

  $sourcePickup = SmoothRange 0.225 0.268 $p
  Draw-ToothMarker $graphics 424 258 18 (1 - $sourcePickup) (1 + ($sourcePickup * 0.12))

  $phoneMagic = HoldFade $p 0.520 0.675 0.750 0.835
  Draw-Glow $graphics 420 438 280 220 (C 255 255 232 150) ($phoneMagic * 0.58)
  Draw-Glow $graphics 420 438 166 132 (C 255 138 99 201) ($phoneMagic * 0.22)

  $photoFlash = HoldFade $p 0.610 0.650 0.695 0.745
  Draw-Glow $graphics 420 438 215 165 (C 255 255 241 178) ($photoFlash * 0.88)

  Draw-MemoryCard $graphics $p
  Draw-SmileFundCard $graphics $p

  $pigPulse = [Math]::Max((HoldFade $p 0.680 0.760 0.890 0.935), (HoldFade $p 0.895 0.955 0.996 1))
  $pigY = Interp-Key $p @(@(0.895, 0), @(0.955, -8), @(0.992, 0), @(1.0, 0))
  $pigScale = Interp-Key $p @(@(0.895, 1), @(0.955, 1.045), @(0.992, 1))
  Draw-Glow $graphics 1148 (610 + $pigY) 150 130 (C 255 255 220 103) ($pigPulse * 0.92)
  Draw-ImageOpacity $graphics $pig 1150 (606 + $pigY) (260 * $pigScale) (260 * $pigScale) 0 1
  Draw-PigSlotGlow $graphics $p $pigY

  Draw-Tanda $graphics $p
  Draw-HeroCoinOverlay $graphics $p
  Draw-Sparkles $graphics $p

  $framePath = Join-Path $framesDir ('frame_{0:D4}.png' -f $FrameIndex)
  $bitmap.Save($framePath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

try {
  if ($OnlyFrame -ge 0) {
    Render-Frame $OnlyFrame
    Write-Host ("Rendered preview frame {0} into {1}" -f $OnlyFrame, $framesDir)
  } else {
    for ($frame = 0; $frame -lt $Frames; $frame++) {
      Render-Frame $frame
      if (($frame % 30) -eq 0) {
        Write-Host ("Rendered frame {0}/{1}" -f $frame, $Frames)
      }
    }

    $mp4Out = Join-Path $publicDir 'tfn-tanda-hero-integrated-loop-v34.mp4'
    $webmOut = Join-Path $publicDir 'tfn-tanda-hero-integrated-loop-v34.webm'
    $posterOut = Join-Path $publicDir 'tfn-tanda-hero-integrated-poster-v34.webp'
    $posterFrame = Join-Path $framesDir ('frame_{0:D4}.png' -f ([Math]::Min($Frames - 1, [Math]::Round($Frames * 0.80))))
    $inputPattern = Join-Path $framesDir 'frame_%04d.png'

    & $FfmpegPath -y -framerate $Fps -i $inputPattern -c:v libx264 -pix_fmt yuv420p -movflags +faststart -crf 21 -preset medium $mp4Out
    & $FfmpegPath -y -framerate $Fps -i $inputPattern -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 3 $webmOut
    & $FfmpegPath -y -i $posterFrame -frames:v 1 -compression_level 6 -quality 82 $posterOut

    Write-Host "Wrote $mp4Out"
    Write-Host "Wrote $webmOut"
    Write-Host "Wrote $posterOut"
    Write-Host "Frames: $framesDir"
  }
} finally {
  $family.Dispose()
  $base.Dispose()
  $pig.Dispose()
  foreach ($pose in $poseImages) {
    $pose.Dispose()
  }
  $labelFont.Dispose()
  $smallFont.Dispose()
  $amountFont.Dispose()
  $savedFont.Dispose()
  $coinFont.Dispose()
  $fontFamily.Dispose()
  $serifFamily.Dispose()
}
