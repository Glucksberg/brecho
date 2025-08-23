// Modelo de dados para Cliente
export class Cliente {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nome = data.nome || '';
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
    this.dataNascimento = data.dataNascimento || null;
    this.genero = data.genero || ''; // 'masculino' | 'feminino' | 'outro'
    this.observacoes = data.observacoes || '';
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
    this.totalCompras = data.totalCompras || 0;
    this.numeroCompras = data.numeroCompras || 0;
    this.ultimaCompra = data.ultimaCompra || null;
  }

  // Métodos de validação
  isValid() {
    return this.nome.length > 0 && this.email.length > 0 && this.isValidEmail();
  }

  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  isValidTelefone() {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return telefoneRegex.test(this.telefone);
  }

  isValidCEP() {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(this.endereco.cep);
  }

  // Métodos utilitários
  getFullName() {
    return this.nome;
  }

  getInitials() {
    return this.nome
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getEnderecoCompleto() {
    const { rua, numero, complemento, bairro, cidade, estado, cep } = this.endereco;
    let endereco = `${rua}, ${numero}`;
    if (complemento) endereco += `, ${complemento}`;
    endereco += ` - ${bairro}, ${cidade}/${estado}`;
    if (cep) endereco += ` - CEP: ${cep}`;
    return endereco;
  }

  getIdade() {
    if (!this.dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(this.dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
    
    return idade;
  }

  getTicketMedio() {
    if (this.numeroCompras === 0) return 0;
    return this.totalCompras / this.numeroCompras;
  }

  getFormattedTotalCompras() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.totalCompras);
  }

  getFormattedTicketMedio() {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.getTicketMedio());
  }

  // Classificação do cliente
  getClassificacao() {
    if (this.totalCompras >= 1000) return 'VIP';
    if (this.totalCompras >= 500) return 'Premium';
    if (this.totalCompras >= 200) return 'Regular';
    return 'Novo';
  }

  // Serialização
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      endereco: this.endereco,
      dataNascimento: this.dataNascimento,
      genero: this.genero,
      observacoes: this.observacoes,
      ativo: this.ativo,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      totalCompras: this.totalCompras,
      numeroCompras: this.numeroCompras,
      ultimaCompra: this.ultimaCompra
    };
  }

  // Criar instância a partir de objeto
  static fromJSON(data) {
    return new Cliente(data);
  }

  // Validação de dados de entrada
  static validate(data) {
    const errors = [];

    if (!data.nome || data.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.email || !Cliente.isValidEmailStatic(data.email)) {
      errors.push('Email inválido');
    }

    if (data.telefone && !Cliente.isValidTelefoneStatic(data.telefone)) {
      errors.push('Telefone deve estar no formato (99) 99999-9999');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static isValidEmailStatic(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidTelefoneStatic(telefone) {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return telefoneRegex.test(telefone);
  }
}

// Mock de clientes para desenvolvimento
export const mockClientes = [
  new Cliente({
    id: 1,
    nome: 'Maria Silva',
    email: 'maria@email.com',
    telefone: '(11) 99999-1111',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    dataNascimento: '1990-05-15',
    genero: 'feminino',
    totalCompras: 850.50,
    numeroCompras: 5,
    ultimaCompra: new Date('2024-01-15')
  }),
  new Cliente({
    id: 2,
    nome: 'João Santos',
    email: 'joao@email.com',
    telefone: '(11) 99999-2222',
    endereco: {
      rua: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100'
    },
    dataNascimento: '1985-10-20',
    genero: 'masculino',
    totalCompras: 1250.00,
    numeroCompras: 8,
    ultimaCompra: new Date('2024-01-20')
  })
];

export default Cliente; 