export type TargetChoice = "none" | "unique" | "ambiguous";

const UPLOAD_LABEL = /\b(upload|attach|choose file|select file|drop file)\b/i;
const NON_UPLOAD_LABEL = /\b(send|submit|post|delete|cancel)\b/i;

export function chooseUploadTarget(count: number): TargetChoice {
  if (count === 1) {
    return "unique";
  }

  return count === 0 ? "none" : "ambiguous";
}

export function isUploadLabel(label: string): boolean {
  const normalized = label.replace(/\s+/g, " ").trim();
  return Boolean(normalized) && !NON_UPLOAD_LABEL.test(normalized) && UPLOAD_LABEL.test(normalized);
}

export function describeUploadInput(input: HTMLInputElement): string {
  return [
    input.getAttribute("aria-label"),
    input.getAttribute("title"),
    input.closest("label")?.textContent,
    input.getAttribute("name"),
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
