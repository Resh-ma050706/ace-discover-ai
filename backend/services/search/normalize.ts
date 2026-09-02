export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

export function normalizeLocation(location: string): string {
  return normalizeText(location);
}

export function normalizeEventType(eventType: string): string {
  return normalizeText(eventType);
}

export function normalizeSkill(skill: string): string {
  return normalizeText(skill);
}