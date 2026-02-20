// Utility for safe fetch with status and error handling
export async function safeFetch(
  url: string,
  notFoundMessage: string,
  networkErrorMessage: string,
): Promise<{ ok: boolean; response?: Response; error?: string }> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (err) {
    return { ok: false, error: networkErrorMessage }
  }
  if (response.status !== 200) {
    return { ok: false, error: notFoundMessage }
  }
  return { ok: true, response }
}

// Utility for safe dynamic import with error handling
export async function safeImport<T = any>(
  path: string,
  errorMessage: string,
): Promise<{ ok: boolean; module?: T; error?: string }> {
  try {
    const imported = await import(/* @vite-ignore */ path)
    return { ok: true, module: imported }
  } catch (err) {
    return { ok: false, error: errorMessage }
  }
}
