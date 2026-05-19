/**
 * Bound an async operation with a timeout. If `promise` doesn't settle
 * within `ms`, the returned promise rejects with a descriptive error
 * — every export step calls this so a hung font-face load or
 * modern-screenshot stall surfaces as an export error toast instead
 * of an indefinite "Rendering..." spinner.
 *
 * `label` identifies the step in the rejection message so the user
 * (and the console) can see *what* timed out.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(handle);
        resolve(value);
      },
      (err: unknown) => {
        clearTimeout(handle);
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    );
  });
}
