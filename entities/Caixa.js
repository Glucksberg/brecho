// Modelo de dados para Caixa
export class Caixa {
  constructor(data = {}) {
    this.id = data.id || null;
    this.operadorId = data.operadorId || null;
    this.operador = data.operador || null; // Objeto User
    this.brechoId = data.brechoId || null; // Para multi-tenant futuro
    this.dataAbertura = data.dataAbertura || new Date();
    this.dataFechamento = data.dataFechamento || null;
    this.status = data.status || 'aberto'; // 'aberto' | 'fechado'

    // Valores de abertura
    this.saldoInicial = data.saldoInicial || 0;
    this.dinheiroInicial = data.dinheiroInicial || 0;

    // Movimentações (calculadas)
    this.totalVendas = data.totalVendas || 0;
    this.totalDespesas = data.totalDespesas || 0;
    this.totalSangrias = data.totalSangrias || 0;
    this.totalReforcos = data.totalReforcos || 0;

    // Valores por forma de pagamento
    this.vendasDinheiro = data.vendasDinheiro || 0;
    this.vendasCartao = data.vendasCartao || 0;
    this.vendasPix = data.vendasPix || 0;
    this.vendasTransferencia = data.vendasTransferencia || 0;

    // Fechamento
    this.saldoEsperado = data.saldoEsperado || 0;
    this.saldoInformado = data.saldoInformado || 0;
    this.diferenca = data.diferenca || 0;
    this.observacoes = data.observacoes || '';

    // Histórico de movimentações detalhadas
    this.movimentacoes = data.movimentacoes || [];

    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Validação
  isValid() {
    return this.operadorId && this.saldoInicial >= 0;
  }

  isAberto() {
    return this.status === 'aberto';
  }

  isFechado() {
    return this.status === 'fechado';
  }

  // Cálculos
  calcularSaldoEsperado() {
    this.saldoEsperado =
      this.saldoInicial +
      this.vendasDinheiro -
      this.totalDespesas -
      this.totalSangrias +
      this.totalReforcos;
    return this.saldoEsperado;
  }

  calcularDiferenca() {
    this.diferenca = this.saldoInformado - this.saldoEsperado;
    return this.diferenca;
  }

  getTotalEntradas() {
    return this.saldoInicial + this.vendasDinheiro + this.totalReforcos;
  }

  getTotalSaidas() {
    return this.totalDespesas + this.totalSangrias;
  }

  // Movimentações
  addMovimentacao(tipo, valor, descricao, formaPagamento = null) {
    const movimentacao = {
      id: Date.now(),
      tipo: tipo, // 'venda' | 'despesa' | 'sangria' | 'reforco'
      valor: valor,
      descricao: descricao,
      formaPagamento: formaPagamento,
      data: new Date(),
      operadorId: this.operadorId
    };

    this.movimentacoes.push(movimentacao);

    // Atualiza totais
    switch (tipo) {
      case 'venda':
        this.totalVendas += valor;
        if (formaPagamento === 'dinheiro') this.vendasDinheiro += valor;
        if (formaPagamento === 'cartao') this.vendasCartao += valor;
        if (formaPagamento === 'pix') this.vendasPix += valor;
        if (formaPagamento === 'transferencia') this.vendasTransferencia += valor;
        break;
      case 'despesa':
        this.totalDespesas += valor;
        break;
      case 'sangria':
        this.totalSangrias += valor;
        break;
      case 'reforco':
        this.totalReforcos += valor;
        break;
    }

    this.calcularSaldoEsperado();
    this.dataAtualizacao = new Date();
  }

  registrarVenda(venda) {
    this.addMovimentacao(
      'venda',
      venda.total,
      `Venda #${venda.numeroVenda}`,
      venda.formaPagamento
    );
  }

  registrarSangria(valor, descricao) {
    this.addMovimentacao('sangria', valor, descricao);
  }

  registrarReforco(valor, descricao) {
    this.addMovimentacao('reforco', valor, descricao);
  }

  registrarDespesa(despesa) {
    this.addMovimentacao(
      'despesa',
      despesa.valor,
      despesa.descricao,
      despesa.formaPagamento
    );
  }

  // Fechamento
  fechar(saldoInformado, observacoes = '') {
    if (!this.isAberto()) return false;

    this.saldoInformado = saldoInformado;
    this.observacoes = observacoes;
    this.calcularSaldoEsperado();
    this.calcularDiferenca();
    this.dataFechamento = new Date();
    this.status = 'fechado';
    this.dataAtualizacao = new Date();

    return true;
  }

  // Formatação
  getFormattedSaldoInicial() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.saldoInicial);
  }

  getFormattedSaldoEsperado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.saldoEsperado);
  }

  getFormattedSaldoInformado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.saldoInformado);
  }

  getFormattedDiferenca() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(this.diferenca));
  }

  getFormattedTotalVendas() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.totalVendas);
  }

  getDiferencaStatus() {
    if (this.diferenca === 0) return 'ok';
    if (this.diferenca > 0) return 'sobra';
    return 'falta';
  }

  getDiferencaLabel() {
    if (this.diferenca === 0) return 'Caixa Correto';
    if (this.diferenca > 0) return 'Sobra';
    return 'Falta';
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      operadorId: this.operadorId,
      operador: this.operador,
      brechoId: this.brechoId,
      dataAbertura: this.dataAbertura,
      dataFechamento: this.dataFechamento,
      status: this.status,
      saldoInicial: this.saldoInicial,
      dinheiroInicial: this.dinheiroInicial,
      totalVendas: this.totalVendas,
      totalDespesas: this.totalDespesas,
      totalSangrias: this.totalSangrias,
      totalReforcos: this.totalReforcos,
      vendasDinheiro: this.vendasDinheiro,
      vendasCartao: this.vendasCartao,
      vendasPix: this.vendasPix,
      vendasTransferencia: this.vendasTransferencia,
      saldoEsperado: this.saldoEsperado,
      saldoInformado: this.saldoInformado,
      diferenca: this.diferenca,
      observacoes: this.observacoes,
      movimentacoes: this.movimentacoes,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao
    };
  }

  static fromJSON(data) {
    return new Caixa(data);
  }

  static validate(data) {
    const errors = [];

    if (!data.operadorId) {
      errors.push('Operador é obrigatório');
    }

    if (data.saldoInicial === undefined || data.saldoInicial < 0) {
      errors.push('Saldo inicial deve ser maior ou igual a zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Mock para desenvolvimento
export const mockCaixas = [
  new Caixa({
    id: 1,
    operadorId: 1,
    dataAbertura: new Date('2025-01-20T08:00:00'),
    dataFechamento: new Date('2025-01-20T18:00:00'),
    status: 'fechado',
    saldoInicial: 100.00,
    totalVendas: 850.00,
    vendasDinheiro: 350.00,
    vendasCartao: 300.00,
    vendasPix: 200.00,
    totalDespesas: 50.00,
    totalSangrias: 200.00,
    saldoEsperado: 200.00,
    saldoInformado: 205.00,
    diferenca: 5.00
  })
];

export default Caixa;
