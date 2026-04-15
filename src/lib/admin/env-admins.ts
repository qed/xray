export function envBootstrapEmails(): string[] {
  const raw = process.env.SUPERADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
