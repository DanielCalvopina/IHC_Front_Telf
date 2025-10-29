// app/authStore.ts
// Pequeño store en memoria para overrides de contraseñas
// Clave = usuario/cédula; Valor = nueva contraseña
const overrides: Record<string, string> = {};

export function setPasswordOverride(id: string, pwd: string) {
  overrides[id] = pwd;
}

export function getPasswordOverride(id: string): string | null {
  return overrides[id] ?? null;
}
