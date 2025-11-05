// Modelo de dados para Crédito de Fornecedora
export class Credito {
  constructor(data = {}) {
    this.id = data.id || null;
    this.fornecedoraId = data.fornecedoraId || null;
    this.fornecedora = data.fornecedora || null; // Objeto Fornecedora
    this.vendaId = data.vendaId || null;
    this.venda = data.venda || null; // Objeto Venda
    this.produtoId = data.produtoId || null;
    this.produto = data.produto || null; // Objeto Produto
    this.valorVenda = data.valorVenda || 0; // Valor que o produto foi vendido
    this.percentualRepasse = data.percentualRepasse || 0;
    this.valorCredito = data.valorCredito || 0; // Valor do crédito gerado
    this.status = data.status || 'pendente'; // 'pendente' | 'liberado' | 'utilizado' | 'pago'
    this.tipoUtilizacao = data.tipoUtilizacao || null; // null | 'produtos' | 'dinheiro'
    this.dataVenda = data.dataVenda || new Date();
    this.dataLiberacao = data.dataLiberacao || null; // Data em que será liberado (30 dias após venda)
    this.dataUtilizacao = data.dataUtilizacao || null;
    this.dataPagamento = data.dataPagamento || null;
    this.observacoes = data.observacoes || '';
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Validação
  isValid() {
    return (
      this.fornecedoraId &&
      this.vendaId &&
      this.valorVenda > 0 &&
      this.percentualRepasse > 0 &&
      this.valorCredito > 0
    );
  }

  isPendente() {
    return this.status === 'pendente';
  }

  isLiberado() {
    return this.status === 'liberado';
  }

  isUtilizado() {
    return this.status === 'utilizado';
  }

  isPago() {
    return this.status === 'pago';
  }

  // Utilitários
  calcularDataLiberacao() {
    const data = new Date(this.dataVenda);
    data.setDate(data.getDate() + 30);
    return data;
  }

  getDiasParaLiberacao() {
    if (!this.isPendente()) return 0;

    const hoje = new Date();
    const liberacao = this.dataLiberacao || this.calcularDataLiberacao();
    const diffTime = liberacao - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  podeSerLiberado() {
    if (!this.isPendente()) return false;
    return this.getDiasParaLiberacao() === 0;
  }

  // Valor com bônus (15% a mais ao usar em produtos)
  getValorComBonus() {
    return this.valorCredito * 1.15;
  }

  getFormattedValorVenda() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valorVenda);
  }

  getFormattedValorCredito() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valorCredito);
  }

  getFormattedValorComBonus() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.getValorComBonus());
  }

  getStatusDisplay() {
    const statusMap = {
      'pendente': 'Pendente (aguardando 30 dias)',
      'liberado': 'Liberado',
      'utilizado': 'Utilizado',
      'pago': 'Pago'
    };
    return statusMap[this.status] || this.status;
  }

  getTipoUtilizacaoDisplay() {
    if (!this.tipoUtilizacao) return '-';
    const tipoMap = {
      'produtos': 'Troca por Produtos',
      'dinheiro': 'Pagamento em Dinheiro'
    };
    return tipoMap[this.tipoUtilizacao] || this.tipoUtilizacao;
  }

  // Ações
  liberar() {
    if (this.isPendente() && this.podeSerLiberado()) {
      this.status = 'liberado';
      this.dataLiberacao = new Date();
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  utilizar(tipo = 'produtos') {
    if (this.isLiberado()) {
      this.status = 'utilizado';
      this.tipoUtilizacao = tipo;
      this.dataUtilizacao = new Date();
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  pagar() {
    if (this.isLiberado()) {
      this.status = 'pago';
      this.tipoUtilizacao = 'dinheiro';
      this.dataPagamento = new Date();
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      fornecedoraId: this.fornecedoraId,
      fornecedora: this.fornecedora,
      vendaId: this.vendaId,
      venda: this.venda,
      produtoId: this.produtoId,
      produto: this.produto,
      valorVenda: this.valorVenda,
      percentualRepasse: this.percentualRepasse,
      valorCredito: this.valorCredito,
      status: this.status,
      tipoUtilizacao: this.tipoUtilizacao,
      dataVenda: this.dataVenda,
      dataLiberacao: this.dataLiberacao,
      dataUtilizacao: this.dataUtilizacao,
      dataPagamento: this.dataPagamento,
      observacoes: this.observacoes,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao
    };
  }

  static fromJSON(data) {
    return new Credito(data);
  }

  static validate(data) {
    const errors = [];

    if (!data.fornecedoraId) {
      errors.push('Fornecedora é obrigatória');
    }

    if (!data.vendaId) {
      errors.push('Venda é obrigatória');
    }

    if (!data.valorVenda || data.valorVenda <= 0) {
      errors.push('Valor da venda deve ser maior que zero');
    }

    if (!data.percentualRepasse || data.percentualRepasse <= 0) {
      errors.push('Percentual de repasse deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Cálculo de crédito
  static calcularCredito(valorVenda, percentualRepasse) {
    return (valorVenda * percentualRepasse) / 100;
  }

  // Criar crédito a partir de venda
  static criarDeVenda(venda, produto, fornecedora) {
    const valorVenda = produto.preco;
    const percentualRepasse = fornecedora.percentualRepasse;
    const valorCredito = Credito.calcularCredito(valorVenda, percentualRepasse);

    const credito = new Credito({
      fornecedoraId: fornecedora.id,
      fornecedora: fornecedora,
      vendaId: venda.id,
      venda: venda,
      produtoId: produto.id,
      produto: produto,
      valorVenda: valorVenda,
      percentualRepasse: percentualRepasse,
      valorCredito: valorCredito,
      status: 'pendente',
      dataVenda: venda.dataVenda,
      dataLiberacao: null
    });

    // Calcula data de liberação (30 dias após venda)
    credito.dataLiberacao = credito.calcularDataLiberacao();

    return credito;
  }
}

// Mock para desenvolvimento
export const mockCreditos = [
  new Credito({
    id: 1,
    fornecedoraId: 1,
    vendaId: 1,
    produtoId: 1,
    valorVenda: 100.00,
    percentualRepasse: 60,
    valorCredito: 60.00,
    status: 'liberado',
    dataVenda: new Date('2024-12-15'),
    dataLiberacao: new Date('2025-01-14')
  }),
  new Credito({
    id: 2,
    fornecedoraId: 1,
    vendaId: 2,
    produtoId: 2,
    valorVenda: 80.00,
    percentualRepasse: 60,
    valorCredito: 48.00,
    status: 'pendente',
    dataVenda: new Date('2025-01-20'),
    dataLiberacao: new Date('2025-02-19')
  })
];

export default Credito;
