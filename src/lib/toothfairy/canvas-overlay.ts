export function createChangedPixelOverlay(
  base: ImageData,
  current: ImageData,
  threshold = 24,
) {
  if (base.width !== current.width || base.height !== current.height) {
    throw new Error("Canvas overlay inputs must be the same size")
  }

  const overlay = new ImageData(base.width, base.height)

  for (let i = 0; i < current.data.length; i += 4) {
    const delta =
      Math.abs(current.data[i] - base.data[i]) +
      Math.abs(current.data[i + 1] - base.data[i + 1]) +
      Math.abs(current.data[i + 2] - base.data[i + 2]) +
      Math.abs(current.data[i + 3] - base.data[i + 3])

    if (delta > threshold && current.data[i + 3] > 0) {
      overlay.data[i] = current.data[i]
      overlay.data[i + 1] = current.data[i + 1]
      overlay.data[i + 2] = current.data[i + 2]
      overlay.data[i + 3] = current.data[i + 3]
    } else {
      overlay.data[i + 3] = 0
    }
  }

  return overlay
}
