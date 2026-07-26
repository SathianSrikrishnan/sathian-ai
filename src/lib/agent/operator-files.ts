interface SignedUrlClient {
  createSignedUrl(
    path: string,
    expiresIn: number,
    options: { download: string },
  ): Promise<{ data: { signedUrl: string } | null; error: unknown }>
}

export async function createOperatorAttachmentUrl(
  storage: SignedUrlClient,
  objectPath: string,
  downloadName: string,
): Promise<{ url: string; expiresInSeconds: 60 }> {
  const expiresInSeconds = 60 as const
  const { data, error } = await storage.createSignedUrl(
    objectPath,
    expiresInSeconds,
    { download: downloadName },
  )
  if (error || !data?.signedUrl) throw new Error('operator_attachment_url_failed')
  return { url: data.signedUrl, expiresInSeconds }
}
