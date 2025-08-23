// Modelo de dados para Despesa
export class Despesa {
  constructor(data = {}) {
    this.id = data.id || null;
    this.descricao = data.descricao || '';
    this.categoria = data.categoria || ''; // 'operacional' | 'marketing' | 'pessoal' | 'produto' | 'outros'
    this.subcategoria = data.subcategoria || '';
    this.valor = data.valor || 0;
    this.dataVencimento = data.dataVencimento || null;
    this.dataPagamento = data.dataPagamento || null;
    this.status = data.status || 'pendente'; // 'pendente' | 'pago' | 'vencido' | 'cancelado'
    this.formaPagamento = data.formaPagamento || ''; // 'dinheiro' | 'cartao' | 'pix' | 'transferencia' | 'boleto'
    this.fornecedor = data.fornecedor || '';
    this.numeroDocumento = data.numeroDocumento || '';
    this.observacoes = data.observacoes || '';
    this.anexos = data.anexos || []; // Array de URLs ou paths para documentos
    this.recorrente = data.recorrente || false;
    this.frequenciaRecorrencia = data.frequenciaRecorrencia || ''; // 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'
    this.proximoVencimento = data.proximoVencimento || null;
    this.contaId = data.contaId || null; // ID da conta bancária
    this.centroCusto = data.centroCusto || '';
    this.usuarioId = data.usuarioId || null; // Quem cadastrou
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Métodos de validação
  isValid() {
    return (
      this.descricao.length > 0 &&
      this.categoria.length > 0 &&
      this.valor > 0
    );
  }

  isPago() {
    return this.status === 'pago';
  }

  isPendente() {
    return this.status === 'pendente';
  }

  isVencido() {
    if (this.status === 'pago') return false;
    if (!this.dataVencimento) return false;
    
    const hoje = new Date();
    const vencimento = new Date(this.dataVencimento);
    return vencimento < hoje;
  }

  isCancelado() {
    return this.status === 'cancelado';
  }

  // Métodos utilitários
  getDiasAteVencimento() {
    if (!this.dataVencimento) return null;
    if (this.isPago()) return null;
    
    const hoje = new Date();
    const vencimento = new Date(this.dataVencimento);
    const diffTime = vencimento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  getDiasEmAtraso() {
    if (!this.isVencido()) return 0;
    
    const hoje = new Date();
    const vencimento = new Date(this.dataVencimento);
    const diffTime = hoje - vencimento;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  getStatusDisplay() {
    if (this.isVencido()) return 'Vencido';
    
    const statusMap = {
      'pendente': 'Pendente',
      'pago': 'Pago',
      'vencido': 'Vencido',
      'cancelado': 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  getCategoriaDisplay() {
    const categoriaMap = {
      'operacional': 'Operacional',
      'marketing': 'Marketing',
      'pessoal': 'Pessoal',
      'produto': 'Produto',
      'outros': 'Outros'
    };
    return categoriaMap[this.categoria] || this.categoria;
  }

  getFormaPagamentoDisplay() {
    const formasMap = {
      'dinheiro': 'Dinheiro',
      'cartao': 'Cartão',
      'pix': 'PIX',
      'transferencia': 'Transferência',
      'boleto': 'Boleto'
    };
    return formasMap[this.formaPagamento] || this.formaPagamento;
  }

  getFormattedValor() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valor);
  }

  getFormattedDataVencimento() {
    if (!this.dataVencimento) return '';
    return new Date(this.dataVencimento).toLocaleDateString('pt-BR');
  }

  getFormattedDataPagamento() {
    if (!this.dataPagamento) return '';
    return new Date(this.dataPagamento).toLocaleDateString('pt-BR');
  }

  // Métodos de ação
  marcarComoPago(dataPagamento = new Date(), formaPagamento = null) {
    this.status = 'pago';
    this.dataPagamento = dataPagamento;
    if (formaPagamento) {
      this.formaPagamento = formaPagamento;
    }
    this.dataAtualizacao = new Date();

    // Se é recorrente, gerar próxima despesa
    if (this.recorrente && this.frequenciaRecorrencia) {
      this.gerarProximaRecorrencia();
    }
  }

  cancelar() {
    this.status = 'cancelado';
    this.dataAtualizacao = new Date();
  }

  gerarProximaRecorrencia() {
    if (!this.recorrente || !this.dataVencimento) return null;

    const proximoVencimento = new Date(this.dataVencimento);
    
    switch (this.frequenciaRecorrencia) {
      case 'mensal':
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
        break;
      case 'bimestral':
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 2);
        break;
      case 'trimestral':
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 3);
        break;
      case 'semestral':
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 6);
        break;
      case 'anual':
        proximoVencimento.setFullYear(proximoVencimento.getFullYear() + 1);
        break;
    }

    this.proximoVencimento = proximoVencimento;
    return proximoVencimento;
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      descricao: this.descricao,
      categoria: this.categoria,
      subcategoria: this.subcategoria,
      valor: this.valor,
      dataVencimento: this.dataVencimento,
      dataPagamento: this.dataPagamento,
      status: this.status,
      formaPagamento: this.formaPagamento,
      fornecedor: this.fornecedor,
      numeroDocumento: this.numeroDocumento,
      observacoes: this.observacoes,
      anexos: this.anexos,
      recorrente: this.recorrente,
      frequenciaRecorrencia: this.frequenciaRecorrencia,
      proximoVencimento: this.proximoVencimento,
      contaId: this.contaId,
      centroCusto: this.centroCusto,
      usuarioId: this.usuarioId,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao
    };
  }

  // Criar instância a partir de objeto
  static fromJSON(data) {
    return new Despesa(data);
  }

  // Validação de dados de entrada
  static validate(data) {
    const errors = [];

    if (!data.descricao || data.descricao.trim().length < 3) {
      errors.push('Descrição deve ter pelo menos 3 caracteres');
    }

    if (!data.categoria || data.categoria.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }

    if (!data.valor || data.valor <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Mock de despesas para desenvolvimento
export const mockDespesas = [
  new Despesa({
    id: 1,
    descricao: 'Aluguel da loja',
    categoria: 'operacional',
    subcategoria: 'Imóvel',
    valor: 2500.00,
    dataVencimento: new Date('2024-02-05'),
    status: 'pendente',
    fornecedor: 'Imobiliária Santos',
    recorrente: true,
    frequenciaRecorrencia: 'mensal',
    centroCusto: 'Loja Principal'
  }),
  new Despesa({
    id: 2,
    descricao: 'Energia elétrica',
    categoria: 'operacional',
    subcategoria: 'Utilidades',
    valor: 350.00,
    dataVencimento: new Date('2024-02-10'),
    dataPagamento: new Date('2024-02-08'),
    status: 'pago',
    formaPagamento: 'pix',
    fornecedor: 'Eletropaulo',
    numeroDocumento: 'EE-2024-001',
    recorrente: true,
    frequenciaRecorrencia: 'mensal'
  }),
  new Despesa({
    id: 3,
    descricao: 'Material de divulgação',
    categoria: 'marketing',
    subcategoria: 'Publicidade',
    valor: 180.00,
    dataVencimento: new Date('2024-01-25'),
    status: 'vencido',
    fornecedor: 'Gráfica Rápida',
    numeroDocumento: 'GR-2024-045'
  })
];

export default Despesa; 