export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export interface FileLease {
  status: "empty" | "selected" | "consumed";
  meta: FileMeta | null;
  reason: string | null;
}

export function createLease(): FileLease {
  return { status: "empty", meta: null, reason: null };
}

export function selectFile(lease: FileLease, meta: FileMeta): FileLease {
  if (meta.size > MAX_FILE_BYTES) {
    return { status: "empty", meta: null, reason: "File is larger than 10 MiB." };
  }

  return { status: "selected", meta, reason: null };
}

export function canAttach(lease: FileLease): boolean {
  return lease.status === "selected" && lease.meta !== null;
}

export function consumeLease(lease: FileLease): FileLease {
  if (!canAttach(lease)) {
    return lease;
  }

  return { status: "consumed", meta: null, reason: null };
}
