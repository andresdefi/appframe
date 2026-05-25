const locks = new Map<string, Promise<void>>();

export async function withProjectLock<T>(
  project: string,
  fn: () => Promise<T>,
): Promise<T> {
  const prev = locks.get(project) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((r) => {
    release = r;
  });
  locks.set(project, next);
  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(project) === next) locks.delete(project);
  }
}
