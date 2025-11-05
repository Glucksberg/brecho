// Modelo de dados para Fornecedora (Consignação)
export class Fornecedora {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.cpf = data.cpf || '';
    this.email = data.email || '';
    this.telefone = data.telefone || '';
    this.endereco = data.endereco || {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    };
    this.percentualRepasse = data.percentualRepasse || 60; // % que a fornecedora recebe
    this.dadosBancarios = data.dadosBancarios || {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente', // 'corrente' | 'poupanca'
      pix: ''
    };
    this.observacoes = data.observacoes || '';
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.dataCadastro = data.dataCadastro || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();

    // Estatísticas
    this.totalProdutosAtivos = data.totalProdutosAtivos || 0;
    this.totalProdutosVendidos = data.totalProdutosVendidos || 0;
    this.totalVendido = data.totalVendido || 0;
    this.creditoDisponivel = data.creditoDisponivel || 0;
    this.creditoPendente = data.creditoPendente || 0; // Aguardando 30 dias
    this.totalRepassado = data.totalRepassado || 0;
    this.ultimaVenda = data.ultimaVenda || null;
    this.ultimoRepasse = data.ultimoRepasse || null;
  }

  // Validação
  isValid() {
    return (
      this.nome.length > 0 &&
      this.telefone.length > 0 &&
      this.percentualRepasse > 0 &&
      this.percentualRepasse <= 100
    );
  }

  isValidCPF() {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(this.cpf);
  }

  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Utilitários
  getFormattedCreditoDisponivel() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.creditoDisponivel);
  }

  getFormattedCreditoPendente() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.creditoPendente);
  }

  getFormattedTotalVendido() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.totalVendido);
  }

  getFormattedTotalRepassado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.totalRepassado);
  }

  // Cálculo de crédito com bônus
  calcularCreditoComBonus() {
    // 15% de bônus ao usar crédito para comprar produtos
    return this.creditoDisponivel * 1.15;
  }

  getFormattedCreditoComBonus() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.calcularCreditoComBonus());
  }

  // Desempenho
  getTaxaConversao() {
    if (this.totalProdutosAtivos === 0 && this.totalProdutosVendidos === 0) return 0;
    const total = this.totalProdutosAtivos + this.totalProdutosVendidos;
    return (this.totalProdutosVendidos / total) * 100;
  }

  getTicketMedio() {
    if (this.totalProdutosVendidos === 0) return 0;
    return this.totalVendido / this.totalProdutosVendidos;
  }

  getFormattedTicketMedio() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.getTicketMedio());
  }

  // Classificação
  getClassificacao() {
    if (this.totalVendido >= 5000) return 'VIP';
    if (this.totalVendido >= 2000) return 'Premium';
    if (this.totalVendido >= 500) return 'Regular';
    return 'Iniciante';
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      telefone: this.telefone,
      endereco: this.endereco,
      percentualRepasse: this.percentualRepasse,
      dadosBancarios: this.dadosBancarios,
      observacoes: this.observacoes,
      ativo: this.ativo,
      dataCadastro: this.dataCadastro,
      dataAtualizacao: this.dataAtualizacao,
      totalProdutosAtivos: this.totalProdutosAtivos,
      totalProdutosVendidos: this.totalProdutosVendidos,
      totalVendido: this.totalVendido,
      creditoDisponivel: this.creditoDisponivel,
      creditoPendente: this.creditoPendente,
      totalRepassado: this.totalRepassado,
      ultimaVenda: this.ultimaVenda,
      ultimoRepasse: this.ultimoRepasse
    };
  }

  static fromJSON(data) {
    return new Fornecedora(data);
  }

  static validate(data) {
    const errors = [];

    if (!data.nome || data.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.telefone || data.telefone.trim().length === 0) {
      errors.push('Telefone é obrigatório');
    }

    if (!data.percentualRepasse || data.percentualRepasse <= 0 || data.percentualRepasse > 100) {
      errors.push('Percentual de repasse deve estar entre 1 e 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Mock para desenvolvimento
export const mockFornecedoras = [
  new Fornecedora({
    id: 1,
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    email: 'maria@email.com',
    telefone: '(65) 99999-1111',
    percentualRepasse: 60,
    totalProdutosAtivos: 15,
    totalProdutosVendidos: 25,
    totalVendido: 3500.00,
    creditoDisponivel: 850.00,
    creditoPendente: 420.00,
    totalRepassado: 1500.00,
    ultimaVenda: new Date('2025-01-15'),
    ultimoRepasse: new Date('2025-01-01')
  }),
  new Fornecedora({
    id: 2,
    nome: 'Ana Santos',
    cpf: '987.654.321-00',
    email: 'ana@email.com',
    telefone: '(65) 99999-2222',
    percentualRepasse: 55,
    totalProdutosAtivos: 8,
    totalProdutosVendidos: 12,
    totalVendido: 1800.00,
    creditoDisponivel: 320.00,
    creditoPendente: 180.00,
    totalRepassado: 800.00,
    ultimaVenda: new Date('2025-01-20'),
    ultimoRepasse: new Date('2024-12-15')
  })
];

export default Fornecedora;
