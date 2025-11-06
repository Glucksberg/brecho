/**
 * Valida CPF brasileiro
 * @param cpf - CPF com ou sem formatação
 * @returns true se CPF é válido
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '')

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validar primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf[9])) return false

  // Validar segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== parseInt(cpf[10])) return false

  return true
}

/**
 * Formata CPF para exibição
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (000.000.000-00)
 */
export function formatarCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Valida email
 * @param email - Email para validar
 * @returns true se email é válido
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida telefone brasileiro
 * @param telefone - Telefone com ou sem formatação
 * @returns true se telefone é válido
 */
export function validarTelefone(telefone: string): boolean {
  const cleaned = telefone.replace(/\D/g, '')
  // Aceita: 11 dígitos (com DDD e 9) ou 10 dígitos (sem 9)
  return cleaned.length === 11 || cleaned.length === 10
}

/**
 * Formata telefone para exibição
 * @param telefone - Telefone sem formatação
 * @returns Telefone formatado (00) 00000-0000
 */
export function formatarTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}
