export function dataTransferHasFiles(dt: DataTransfer | null): boolean {
  if (!dt) return false;
  // Some browsers (Safari) populate items but not types until drop. Check both.
  if (dt.types && Array.from(dt.types).some((t) => t === 'Files')) return true;
  if (dt.items && Array.from(dt.items).some((i) => i.kind === 'file')) return true;
  return false;
}
