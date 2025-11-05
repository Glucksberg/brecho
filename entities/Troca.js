// Modelo de dados para Troca e Devolução
export class Troca {
  constructor(data = {}) {
    this.id = data.id || null;
    this.vendaId = data.vendaId || null;
    this.venda = data.venda || null; // Objeto Venda original
    this.clienteId = data.clienteId || null;
    this.cliente = data.cliente || null; // Objeto Cliente
    this.tipo = data.tipo || 'troca'; // 'troca' | 'devolucao'
    this.origem = data.origem || 'presencial'; // 'presencial' | 'online'
    this.motivo = data.motivo || 'sem_defeito'; // 'defeito' | 'sem_defeito' | 'desistencia'
    this.descricaoMotivo = data.descricaoMotivo || '';

    // Produto original
    this.produtoOriginalId = data.produtoOriginalId || null;
    this.produtoOriginal = data.produtoOriginal || null;
    this.valorProdutoOriginal = data.valorProdutoOriginal || 0;

    // Produto novo (em caso de troca)
    this.produtoNovoId = data.produtoNovoId || null;
    this.produtoNovo = data.produtoNovo || null;
    this.valorProdutoNovo = data.valorProdutoNovo || 0;

    // Valores
    this.valorDiferenca = data.valorDiferenca || 0; // + cliente recebe, - cliente paga
    this.valorEstornado = data.valorEstornado || 0; // Em caso de devolução

    // Controle
    this.status = data.status || 'solicitado'; // 'solicitado' | 'aprovado' | 'recusado' | 'concluido' | 'cancelado'
    this.dataSolicitacao = data.dataSolicitacao || new Date();
    this.dataAprovacao = data.dataAprovacao || null;
    this.dataConclusao = data.dataConclusao || null;
    this.prazoLimite = data.prazoLimite || null; // Para compras online (7 dias CDC)

    // Frete (para devoluções online)
    this.freteDevolvido = data.freteDevolvido || false;
    this.valorFrete = data.valorFrete || 0;
    this.codigoRastreio = data.codigoRastreio || '';

    // Responsável pela análise
    this.analisadoPorId = data.analisadoPorId || null;
    this.analisadoPor = data.analisadoPor || null; // Objeto User
    this.observacoes = data.observacoes || '';

    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Validação
  isValid() {
    if (this.tipo === 'troca') {
      return this.vendaId && this.produtoOriginalId && this.produtoNovoId;
    }
    return this.vendaId && this.produtoOriginalId;
  }

  // Status
  isSolicitado() {
    return this.status === 'solicitado';
  }

  isAprovado() {
    return this.status === 'aprovado';
  }

  isRecusado() {
    return this.status === 'recusado';
  }

  isConcluido() {
    return this.status === 'concluido';
  }

  isCancelado() {
    return this.status === 'cancelado';
  }

  // Regras de negócio
  isDentroDoPrazo() {
    if (!this.prazoLimite) return true;
    const hoje = new Date();
    return hoje <= new Date(this.prazoLimite);
  }

  getDiasRestantes() {
    if (!this.prazoLimite) return null;
    const hoje = new Date();
    const prazo = new Date(this.prazoLimite);
    const diffTime = prazo - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // Validar regras de troca
  validarRegras() {
    const erros = [];

    // ONLINE: sempre pode devolver dentro de 7 dias (CDC)
    if (this.origem === 'online') {
      if (!this.isDentroDoPrazo()) {
        erros.push('Prazo de 7 dias para devolução expirado');
      }
      // Online sempre é devolução com estorno
      if (this.tipo !== 'devolucao') {
        erros.push('Compras online só podem ser devolvidas, não trocadas');
      }
      return { valido: erros.length === 0, erros };
    }

    // PRESENCIAL COM DEFEITO:
    // - Pode trocar por produto de igual ou menor valor (devolve diferença)
    // - Pode trocar por produto de maior valor (cliente paga diferença)
    if (this.origem === 'presencial' && this.motivo === 'defeito') {
      if (this.tipo === 'troca') {
        // Qualquer valor é permitido
        return { valido: true, erros: [] };
      }
      // Devolução com defeito: estorna valor
      return { valido: true, erros: [] };
    }

    // PRESENCIAL SEM DEFEITO:
    // - Pode trocar por produto de igual ou maior valor (cliente paga diferença)
    // - NÃO pode devolver por dinheiro
    if (this.origem === 'presencial' && this.motivo === 'sem_defeito') {
      if (this.tipo === 'devolucao') {
        erros.push('Trocas sem defeito não permitem devolução em dinheiro');
      }
      if (this.tipo === 'troca' && this.valorProdutoNovo < this.valorProdutoOriginal) {
        erros.push('Para trocas sem defeito, o novo produto deve ter valor igual ou maior');
      }
      return { valido: erros.length === 0, erros };
    }

    return { valido: erros.length === 0, erros };
  }

  // Cálculos
  calcularDiferenca() {
    if (this.tipo === 'devolucao') {
      this.valorDiferenca = 0;
      this.valorEstornado = this.valorProdutoOriginal;
    } else {
      this.valorDiferenca = this.valorProdutoNovo - this.valorProdutoOriginal;
    }
    return this.valorDiferenca;
  }

  // Ações
  aprovar(userId) {
    if (this.isSolicitado()) {
      const validacao = this.validarRegras();
      if (!validacao.valido) {
        return { sucesso: false, erros: validacao.erros };
      }

      this.status = 'aprovado';
      this.dataAprovacao = new Date();
      this.analisadoPorId = userId;
      this.dataAtualizacao = new Date();
      return { sucesso: true };
    }
    return { sucesso: false, erros: ['Status não permite aprovação'] };
  }

  recusar(userId, motivo) {
    if (this.isSolicitado()) {
      this.status = 'recusado';
      this.observacoes = motivo;
      this.analisadoPorId = userId;
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  concluir() {
    if (this.isAprovado()) {
      this.status = 'concluido';
      this.dataConclusao = new Date();
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  cancelar() {
    if (this.isSolicitado() || this.isAprovado()) {
      this.status = 'cancelado';
      this.dataAtualizacao = new Date();
      return true;
    }
    return false;
  }

  // Formatação
  getFormattedValorDiferenca() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(this.valorDiferenca));
  }

  getFormattedValorEstornado() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valorEstornado);
  }

  getTipoDisplay() {
    return this.tipo === 'troca' ? 'Troca' : 'Devolução';
  }

  getOrigemDisplay() {
    return this.origem === 'presencial' ? 'Presencial' : 'Online';
  }

  getMotivoDisplay() {
    const motivoMap = {
      'defeito': 'Produto com Defeito',
      'sem_defeito': 'Sem Defeito',
      'desistencia': 'Desistência (CDC)'
    };
    return motivoMap[this.motivo] || this.motivo;
  }

  getStatusDisplay() {
    const statusMap = {
      'solicitado': 'Aguardando Análise',
      'aprovado': 'Aprovado',
      'recusado': 'Recusado',
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  getDiferencaLabel() {
    if (this.tipo === 'devolucao') {
      return 'Estornar para Cliente';
    }
    if (this.valorDiferenca > 0) {
      return 'Cliente Deve Pagar';
    }
    if (this.valorDiferenca < 0) {
      return 'Devolver ao Cliente';
    }
    return 'Sem Diferença';
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      vendaId: this.vendaId,
      venda: this.venda,
      clienteId: this.clienteId,
      cliente: this.cliente,
      tipo: this.tipo,
      origem: this.origem,
      motivo: this.motivo,
      descricaoMotivo: this.descricaoMotivo,
      produtoOriginalId: this.produtoOriginalId,
      produtoOriginal: this.produtoOriginal,
      valorProdutoOriginal: this.valorProdutoOriginal,
      produtoNovoId: this.produtoNovoId,
      produtoNovo: this.produtoNovo,
      valorProdutoNovo: this.valorProdutoNovo,
      valorDiferenca: this.valorDiferenca,
      valorEstornado: this.valorEstornado,
      status: this.status,
      dataSolicitacao: this.dataSolicitacao,
      dataAprovacao: this.dataAprovacao,
      dataConclusao: this.dataConclusao,
      prazoLimite: this.prazoLimite,
      freteDevolvido: this.freteDevolvido,
      valorFrete: this.valorFrete,
      codigoRastreio: this.codigoRastreio,
      analisadoPorId: this.analisadoPorId,
      analisadoPor: this.analisadoPor,
      observacoes: this.observacoes,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao
    };
  }

  static fromJSON(data) {
    return new Troca(data);
  }

  // Calcular prazo limite (7 dias para online)
  static calcularPrazoLimite(dataCompra, origem) {
    if (origem === 'online') {
      const prazo = new Date(dataCompra);
      prazo.setDate(prazo.getDate() + 7);
      return prazo;
    }
    return null; // Presencial não tem prazo fixo
  }

  // Criar troca/devolução
  static criar(params) {
    const troca = new Troca(params);

    // Calcular prazo se for online
    if (troca.origem === 'online' && troca.venda) {
      troca.prazoLimite = Troca.calcularPrazoLimite(troca.venda.dataVenda, 'online');
    }

    // Calcular diferença
    troca.calcularDiferenca();

    return troca;
  }

  static validate(data) {
    const errors = [];

    if (!data.vendaId) {
      errors.push('Venda é obrigatória');
    }

    if (!data.produtoOriginalId) {
      errors.push('Produto original é obrigatório');
    }

    if (data.tipo === 'troca' && !data.produtoNovoId) {
      errors.push('Produto novo é obrigatório para trocas');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Mock para desenvolvimento
export const mockTrocas = [
  new Troca({
    id: 1,
    vendaId: 1,
    clienteId: 1,
    tipo: 'troca',
    origem: 'presencial',
    motivo: 'sem_defeito',
    produtoOriginalId: 1,
    valorProdutoOriginal: 80.00,
    produtoNovoId: 2,
    valorProdutoNovo: 100.00,
    valorDiferenca: 20.00,
    status: 'concluido',
    dataSolicitacao: new Date('2025-01-15'),
    dataAprovacao: new Date('2025-01-15'),
    dataConclusao: new Date('2025-01-15')
  }),
  new Troca({
    id: 2,
    vendaId: 2,
    clienteId: 2,
    tipo: 'devolucao',
    origem: 'online',
    motivo: 'desistencia',
    produtoOriginalId: 3,
    valorProdutoOriginal: 120.00,
    valorEstornado: 120.00,
    status: 'solicitado',
    dataSolicitacao: new Date('2025-01-20'),
    prazoLimite: new Date('2025-01-27')
  })
];

export default Troca;
