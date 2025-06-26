// Função para criar URLs das páginas
export function createPageUrl(pageName) {
  return `/${pageName}`;
}

// Função para formatar preço
export function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// Função para formatar data
export function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Função para validar email
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para gerar ID único
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Função para truncar texto
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Função para merge de classes CSS (útil para Tailwind)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
} 