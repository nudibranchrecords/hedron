interface ErrorResult {
  ok: false
  error: string
}

// Utility for safe dynamic import with error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeImport<T = any>(
  path: string,
): Promise<{ ok: true; module?: T } | ErrorResult> {
  try {
    const imported = await import(/* @vite-ignore */ path)
    return { ok: true, module: imported }
  } catch (err) {
    let message = 'Unknown error'
    if (err instanceof Error) {
      message = err.message
    }
    return { ok: false, error: `Error importing module at ${path}: ${message}` }
  }
}
