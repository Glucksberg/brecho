// Modelo de dados para Venda
export class Venda {
  constructor(data = {}) {
    this.id = data.id || null;
    this.clienteId = data.clienteId || null;
    this.cliente = data.cliente || null; // Objeto Cliente
    this.itens = data.itens || []; // Array de { produtoId, produto, quantidade, precoUnitario, subtotal }
    this.subtotal = data.subtotal || 0;
    this.desconto = data.desconto || 0;
    this.total = data.total || 0;
    this.formaPagamento = data.formaPagamento || ''; // 'dinheiro' | 'cartao' | 'pix' | 'transferencia'
    this.status = data.status || 'pendente'; // 'pendente' | 'pago' | 'cancelado' | 'estornado'
    this.observacoes = data.observacoes || '';
    this.dataVenda = data.dataVenda || new Date();
    this.dataPagamento = data.dataPagamento || null;
    this.vendedorId = data.vendedorId || null;
    this.vendedor = data.vendedor || null; // Objeto User
    this.numeroVenda = data.numeroVenda || null;
    this.cupomDesconto = data.cupomDesconto || null;
    this.taxaEntrega = data.taxaEntrega || 0;
    this.enderecoEntrega = data.enderecoEntrega || null;
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
  }

  // Métodos de validação
  isValid() {
    return (
      this.itens.length > 0 &&
      this.total > 0 &&
      this.formaPagamento.length > 0
    );
  }

  isPago() {
    return this.status === 'pago';
  }

  isPendente() {
    return this.status === 'pendente';
  }

  isCancelado() {
    return this.status === 'cancelado';
  }

  // Métodos utilitários
  calcularSubtotal() {
    return this.itens.reduce((total, item) => {
      return total + (item.quantidade * item.precoUnitario);
    }, 0);
  }

  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    return subtotal - this.desconto + this.taxaEntrega;
  }

  atualizarTotais() {
    this.subtotal = this.calcularSubtotal();
    this.total = this.calcularTotal();
  }

  adicionarItem(produto, quantidade = 1) {
    const itemExistente = this.itens.find(item => item.produtoId === produto.id);
    
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
      this.itens.push({
        produtoId: produto.id,
        produto: produto,
        quantidade: quantidade,
        precoUnitario: produto.preco,
        subtotal: quantidade * produto.preco
      });
    }
    
    this.atualizarTotais();
  }

  removerItem(produtoId) {
    this.itens = this.itens.filter(item => item.produtoId !== produtoId);
    this.atualizarTotais();
  }

  atualizarQuantidadeItem(produtoId, novaQuantidade) {
    const item = this.itens.find(item => item.produtoId === produtoId);
    if (item) {
      if (novaQuantidade <= 0) {
        this.removerItem(produtoId);
      } else {
        item.quantidade = novaQuantidade;
        item.subtotal = item.quantidade * item.precoUnitario;
        this.atualizarTotais();
      }
    }
  }

  getQuantidadeItens() {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  getFormattedSubtotal() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.subtotal);
  }

  getFormattedDesconto() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.desconto);
  }

  getFormattedTotal() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.total);
  }

  getFormattedTaxaEntrega() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.taxaEntrega);
  }

  getStatusDisplay() {
    const statusMap = {
      'pendente': 'Pendente',
      'pago': 'Pago',
      'cancelado': 'Cancelado',
      'estornado': 'Estornado'
    };
    return statusMap[this.status] || this.status;
  }

  getFormaPagamentoDisplay() {
    const formasMap = {
      'dinheiro': 'Dinheiro',
      'cartao': 'Cartão',
      'pix': 'PIX',
      'transferencia': 'Transferência'
    };
    return formasMap[this.formaPagamento] || this.formaPagamento;
  }

  gerarNumeroVenda() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const sequencial = String(this.id || Math.floor(Math.random() * 9999)).padStart(4, '0');
    
    this.numeroVenda = `${ano}${mes}${dia}${sequencial}`;
    return this.numeroVenda;
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      cliente: this.cliente,
      itens: this.itens,
      subtotal: this.subtotal,
      desconto: this.desconto,
      total: this.total,
      formaPagamento: this.formaPagamento,
      status: this.status,
      observacoes: this.observacoes,
      dataVenda: this.dataVenda,
      dataPagamento: this.dataPagamento,
      vendedorId: this.vendedorId,
      vendedor: this.vendedor,
      numeroVenda: this.numeroVenda,
      cupomDesconto: this.cupomDesconto,
      taxaEntrega: this.taxaEntrega,
      enderecoEntrega: this.enderecoEntrega,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao
    };
  }

  // Criar instância a partir de objeto
  static fromJSON(data) {
    return new Venda(data);
  }

  // Validação de dados de entrada
  static validate(data) {
    const errors = [];

    if (!data.itens || data.itens.length === 0) {
      errors.push('Venda deve ter pelo menos um item');
    }

    if (!data.formaPagamento || data.formaPagamento.trim().length === 0) {
      errors.push('Forma de pagamento é obrigatória');
    }

    if (!data.total || data.total <= 0) {
      errors.push('Total deve ser maior que zero');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Mock de vendas para desenvolvimento
export const mockVendas = [
  new Venda({
    id: 1,
    clienteId: 1,
    itens: [
      {
        produtoId: 1,
        quantidade: 1,
        precoUnitario: 89.90,
        subtotal: 89.90
      }
    ],
    subtotal: 89.90,
    desconto: 0,
    total: 89.90,
    formaPagamento: 'pix',
    status: 'pago',
    dataVenda: new Date('2024-01-15'),
    dataPagamento: new Date('2024-01-15'),
    numeroVenda: '2024011500001'
  }),
  new Venda({
    id: 2,
    clienteId: 2,
    itens: [
      {
        produtoId: 2,
        quantidade: 1,
        precoUnitario: 65.00,
        subtotal: 65.00
      },
      {
        produtoId: 3,
        quantidade: 1,
        precoUnitario: 120.00,
        subtotal: 120.00
      }
    ],
    subtotal: 185.00,
    desconto: 10.00,
    total: 175.00,
    formaPagamento: 'cartao',
    status: 'pago',
    dataVenda: new Date('2024-01-20'),
    dataPagamento: new Date('2024-01-20'),
    numeroVenda: '2024012000002'
  })
];

export default Venda; 