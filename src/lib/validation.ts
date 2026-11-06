export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidGermanPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return /^[0-9+()\-\s]{5,20}$/.test(value.trim());
}
