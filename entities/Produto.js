// Modelo de dados para Produto
export class Produto {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
    this.descricao = data.descricao || '';
    this.preco = data.preco || 0;
    this.precoOriginal = data.precoOriginal || null;
    this.categoria = data.categoria || '';
    this.subcategoria = data.subcategoria || '';
    this.tamanho = data.tamanho || '';
    this.cor = data.cor || '';
    this.marca = data.marca || '';
    this.condicao = data.condicao || 'usado'; // 'novo' | 'usado' | 'seminovo'
    this.genero = data.genero || ''; // 'masculino' | 'feminino' | 'unissex' | 'infantil'
    this.imagens = data.imagens || [];
    this.imagemPrincipal = data.imagemPrincipal || '';
    this.estoque = data.estoque || 1;
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.destaque = data.destaque || false;
    this.tags = data.tags || [];

    // Consignação
    this.tipo = data.tipo || 'proprio'; // 'proprio' | 'consignado'
    this.fornecedoraId = data.fornecedoraId || null;
    this.fornecedora = data.fornecedora || null; // Objeto Fornecedora

    // Código de barras
    this.codigoBarras = data.codigoBarras || '';
    this.sku = data.sku || ''; // SKU interno

    // Controle
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
    this.vendido = data.vendido || false;
    this.dataVenda = data.dataVenda || null;
    this.peso = data.peso || 0; // em gramas
    this.dimensoes = data.dimensoes || {
      altura: 0,
      largura: 0,
      profundidade: 0
    };

    // Para multi-tenant futuro
    this.brechoId = data.brechoId || null;
  }

  // Métodos de validação
  isValid() {
    return (
      this.nome.length > 0 &&
      this.preco > 0 &&
      this.categoria.length > 0 &&
      this.estoque >= 0
    );
  }

  isAvailable() {
    return this.ativo && !this.vendido && this.estoque > 0;
  }

  isInStock() {
    return this.estoque > 0;
  }

  isSale() {
    return this.precoOriginal && this.precoOriginal > this.preco;
  }

  isConsignado() {
    return this.tipo === 'consignado' && this.fornecedoraId !== null;
  }

  isProprio() {
    return this.tipo === 'proprio';
  }

  // Métodos utilitários
  getDiscountPercent() {
    if (!this.isSale()) return 0;
    return Math.round(((this.precoOriginal - this.preco) / this.precoOriginal) * 100);
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.preco);
  }

  getFormattedOriginalPrice() {
    if (!this.precoOriginal) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.precoOriginal);
  }

  getMainImage() {
    return this.imagemPrincipal || this.imagens[0] || '/placeholder-product.jpg';
  }

  getCondicaoDisplay() {
    const condicoes = {
      'novo': 'Novo',
      'seminovo': 'Semi-novo',
      'usado': 'Usado'
    };
    return condicoes[this.condicao] || 'Usado';
  }

  getGeneroDisplay() {
    const generos = {
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'unissex': 'Unissex',
      'infantil': 'Infantil'
    };
    return generos[this.genero] || '';
  }

  getCategoriaCompleta() {
    if (this.subcategoria) {
      return `${this.categoria} > ${this.subcategoria}`;
    }
    return this.categoria;
  }

  getTipoDisplay() {
    return this.tipo === 'proprio' ? 'Próprio' : 'Consignado';
  }

  getFornecedoraNome() {
    if (this.fornecedora) {
      return this.fornecedora.nome;
    }
    return '-';
  }

  // Gerar código de barras aleatório (EAN-13 simplificado)
  gerarCodigoBarras() {
    if (this.codigoBarras) return this.codigoBarras;

    // Gera 12 dígitos aleatórios + 1 dígito verificador
    const codigo = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');

    // Cálculo simples do dígito verificador (EAN-13)
    let soma = 0;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(codigo[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const digitoVerificador = (10 - (soma % 10)) % 10;

    this.codigoBarras = codigo + digitoVerificador;
    return this.codigoBarras;
  }

  // Busca e filtros
  matchesSearch(query) {
    const searchQuery = query.toLowerCase();
    return (
      this.nome.toLowerCase().includes(searchQuery) ||
      this.descricao.toLowerCase().includes(searchQuery) ||
      this.categoria.toLowerCase().includes(searchQuery) ||
      this.subcategoria.toLowerCase().includes(searchQuery) ||
      this.marca.toLowerCase().includes(searchQuery) ||
      this.cor.toLowerCase().includes(searchQuery) ||
      this.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  matchesFilters(filters) {
    // Filtro por categoria
    if (filters.categoria && this.categoria !== filters.categoria) {
      return false;
    }

    // Filtro por subcategoria
    if (filters.subcategoria && this.subcategoria !== filters.subcategoria) {
      return false;
    }

    // Filtro por preço
    if (filters.precoMin && this.preco < filters.precoMin) {
      return false;
    }
    if (filters.precoMax && this.preco > filters.precoMax) {
      return false;
    }

    // Filtro por tamanho
    if (filters.tamanho && this.tamanho !== filters.tamanho) {
      return false;
    }

    // Filtro por cor
    if (filters.cor && this.cor !== filters.cor) {
      return false;
    }

    // Filtro por marca
    if (filters.marca && this.marca !== filters.marca) {
      return false;
    }

    // Filtro por condição
    if (filters.condicao && this.condicao !== filters.condicao) {
      return false;
    }

    // Filtro por gênero
    if (filters.genero && this.genero !== filters.genero) {
      return false;
    }

    return true;
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      precoOriginal: this.precoOriginal,
      categoria: this.categoria,
      subcategoria: this.subcategoria,
      tamanho: this.tamanho,
      cor: this.cor,
      marca: this.marca,
      condicao: this.condicao,
      genero: this.genero,
      imagens: this.imagens,
      imagemPrincipal: this.imagemPrincipal,
      estoque: this.estoque,
      ativo: this.ativo,
      destaque: this.destaque,
      tags: this.tags,
      tipo: this.tipo,
      fornecedoraId: this.fornecedoraId,
      fornecedora: this.fornecedora,
      codigoBarras: this.codigoBarras,
      sku: this.sku,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      vendido: this.vendido,
      dataVenda: this.dataVenda,
      peso: this.peso,
      dimensoes: this.dimensoes,
      brechoId: this.brechoId
    };
  }

  // Criar instância a partir de objeto
  static fromJSON(data) {
    return new Produto(data);
  }

  // Validação de dados de entrada
  static validate(data) {
    const errors = [];

    if (!data.nome || data.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.preco || data.preco <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (!data.categoria || data.categoria.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }

    if (data.estoque < 0) {
      errors.push('Estoque não pode ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Dados mock para desenvolvimento
export const mockProdutos = [
  new Produto({
    id: 1,
    nome: 'Vestido Floral Vintage',
    descricao: 'Lindo vestido vintage com estampa floral, perfeito para ocasiões especiais.',
    preco: 89.90,
    precoOriginal: 120.00,
    categoria: 'Roupas',
    subcategoria: 'Vestidos',
    tamanho: 'M',
    cor: 'Azul',
    marca: 'Vintage Style',
    condicao: 'seminovo',
    genero: 'feminino',
    imagens: ['/images/vestido1.jpg', '/images/vestido1-2.jpg'],
    imagemPrincipal: '/images/vestido1.jpg',
    estoque: 1,
    ativo: true,
    destaque: true,
    tags: ['vintage', 'floral', 'festa'],
    dataCriacao: new Date('2024-01-15'),
    dataAtualizacao: new Date(),
    peso: 300
  }),
  new Produto({
    id: 2,
    nome: 'Jaqueta Jeans Clássica',
    descricao: 'Jaqueta jeans clássica em excelente estado, ideal para compor looks casuais.',
    preco: 65.00,
    categoria: 'Roupas',
    subcategoria: 'Jaquetas',
    tamanho: 'G',
    cor: 'Azul',
    marca: 'Levi\'s',
    condicao: 'usado',
    genero: 'unissex',
    imagens: ['/images/jaqueta1.jpg'],
    imagemPrincipal: '/images/jaqueta1.jpg',
    estoque: 1,
    ativo: true,
    destaque: false,
    tags: ['jeans', 'casual', 'clássico'],
    dataCriacao: new Date('2024-01-20'),
    dataAtualizacao: new Date(),
    peso: 600
  }),
  new Produto({
    id: 3,
    nome: 'Bolsa de Couro Marrom',
    descricao: 'Bolsa de couro legítimo em cor marrom, com alça ajustável e vários compartimentos.',
    preco: 120.00,
    precoOriginal: 180.00,
    categoria: 'Acessórios',
    subcategoria: 'Bolsas',
    tamanho: 'Único',
    cor: 'Marrom',
    marca: 'Artesanal',
    condicao: 'seminovo',
    genero: 'feminino',
    imagens: ['/images/bolsa1.jpg'],
    imagemPrincipal: '/images/bolsa1.jpg',
    estoque: 1,
    ativo: true,
    destaque: true,
    tags: ['couro', 'elegante', 'funcional'],
    dataCriacao: new Date('2024-01-25'),
    dataAtualizacao: new Date(),
    peso: 800
  })
];

export default Produto; 