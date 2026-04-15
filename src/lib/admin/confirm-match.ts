export function emailMatches(typed: string, target: string): boolean {
  if (!target) return false;
  return typed.trim().toLowerCase() === target.trim().toLowerCase();
}
