import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const TOOTHLIGHT_IMAGE_BUCKET = 'toothlight-images'
export const MAX_TOOTHLIGHT_IMAGE_BYTES = 5 * 1024 * 1024

const SUPPORTED_IMAGE_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
])

type MediaClient = SupabaseClient<any, 'public', any>

export type ParsedDataUrlImage = {
  mimeType: string
  extension: string
  buffer: Buffer
}

export type UploadToothlightImageInput = {
  userId: string
  imageSrc?: string | null
}

export async function uploadToothlightImage(
  { userId, imageSrc }: UploadToothlightImageInput,
  client = createServiceClient(),
) {
  if (!imageSrc) return null
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc
  if (!client) return imageSrc

  const image = parseDataUrlImage(imageSrc)
  const path = `${userId}/${crypto.randomUUID()}.${image.extension}`

  const { error } = await client.storage.from(TOOTHLIGHT_IMAGE_BUCKET).upload(
    path,
    image.buffer,
    {
      contentType: image.mimeType,
      upsert: false,
    },
  )

  if (error) throw new Error(error.message)

  const { data } = client.storage.from(TOOTHLIGHT_IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function parseDataUrlImage(imageSrc: string): ParsedDataUrlImage {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)$/.exec(imageSrc)
  if (!match) throw new Error('Toothlight image must be a supported data URL.')

  const mimeType = match[1].toLowerCase()
  const extension = SUPPORTED_IMAGE_TYPES.get(mimeType)
  if (!extension) {
    throw new Error('Toothlight image must be PNG, JPEG, or WebP.')
  }

  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.byteLength > MAX_TOOTHLIGHT_IMAGE_BYTES) {
    throw new Error('Toothlight image is too large.')
  }

  return { mimeType, extension, buffer }
}

function createServiceClient(): MediaClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}
