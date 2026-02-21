interface ErrorResult {
  ok: false
  error: string
}

// Utility for safe dynamic import with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeImport<T = any>(
  path: string,
  errorMessage: string,
): Promise<{ ok: true; module?: T } | ErrorResult> {
  try {
    const imported = await import(/* @vite-ignore */ path)
    return { ok: true, module: imported }
  } catch (err) {
    return { ok: false, error: errorMessage }
  }
}
