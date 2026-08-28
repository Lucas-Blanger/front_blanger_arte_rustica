/**
 * Formata um valor de CEP para o padrão brasileiro: 00000-000
 * Limita a no máximo 8 dígitos numéricos.
 * @param {string} value 
 * @returns {string}
 */
export function formatCep(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}
