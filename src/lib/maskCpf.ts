export function onlyDigits(v: string): string {
  return (v || "").replace(/\D/g, "");
}

export function formatCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** ***.***.***-123 — mantém apenas os 3 últimos dígitos. */
export function maskCpf(cpf: string): string {
  const d = onlyDigits(cpf);
  if (d.length < 4) return "***.***.***-***";
  return `***.***.***-${d.slice(-3)}`;
}

export function displayCpf(cpf: string, canSeeFull: boolean): string {
  if (!cpf) return "—";
  return canSeeFull ? formatCpf(cpf) : maskCpf(cpf);
}
