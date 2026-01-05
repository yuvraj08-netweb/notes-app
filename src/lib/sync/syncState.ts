const KEY = "notes_last_sync";

export function getLastSync(): number {
  return Number(localStorage.getItem(KEY) || 0);
}

export function setLastSync(ts: number) {
  localStorage.setItem(KEY, String(ts));
}
