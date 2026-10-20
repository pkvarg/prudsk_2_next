// Browser side: gets an upload token from /api/upload-token (admin login required) and reuses it
// until shortly before it expires.
let tokenRequest = null

const requestUploadToken = async () => {
  const response = await fetch('/api/upload-token', { method: 'POST' })
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? 'Prihlásenie vypršalo. Prihláste sa znova a nahrajte súbor ešte raz.'
        : `Nepodarilo sa získať povolenie na nahrávanie (HTTP ${response.status}).`,
    )
  }
  return response.json()
}

export const uploadAuthHeaders = async () => {
  const current = tokenRequest ? await tokenRequest.catch(() => null) : null
  if (current && current.expiresAt - 60_000 > Date.now()) {
    return { Authorization: `Bearer ${current.token}` }
  }
  tokenRequest = requestUploadToken()
  try {
    return { Authorization: `Bearer ${(await tokenRequest).token}` }
  } catch (err) {
    tokenRequest = null
    throw err
  }
}
