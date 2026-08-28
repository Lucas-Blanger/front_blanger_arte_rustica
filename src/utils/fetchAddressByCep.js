/**
 * Consulta CEP na API pública do ViaCEP (https://viacep.com.br/)
 * @param {string} cep 
 * @returns {Promise<{ street: string, neighborhood: string, city: string, state: string } | null>}
 */
export async function fetchAddressByCep(cep) {
  const cleanCep = String(cep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.erro) return null;

    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch {
    return null;
  }
}
