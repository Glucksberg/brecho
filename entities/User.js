// Modelo de dados para Usuário
export class User {
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
    this.tipo = data.tipo || 'cliente'; // 'cliente' | 'admin'
    this.avatar = data.avatar || '';
    this.dataCriacao = data.dataCriacao || new Date();
    this.dataAtualizacao = data.dataAtualizacao || new Date();
    this.ativo = data.ativo !== undefined ? data.ativo : true;
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

  isAdmin() {
    return this.tipo === 'admin';
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

  // Serialização
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      endereco: this.endereco,
      tipo: this.tipo,
      avatar: this.avatar,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      ativo: this.ativo
    };
  }

  // Criar instância a partir de objeto
  static fromJSON(data) {
    return new User(data);
  }

  // Validação de dados de entrada
  static validate(data) {
    const errors = [];

    if (!data.nome || data.nome.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!data.email || !User.isValidEmailStatic(data.email)) {
      errors.push('Email inválido');
    }

    if (data.telefone && !User.isValidTelefoneStatic(data.telefone)) {
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

// Mock de usuário para desenvolvimento
export const mockUser = new User({
  id: 1,
  nome: 'Admin CloudFarm',
  email: 'admin@cloudfarm.io',
  telefone: '(11) 99999-9999',
  endereco: {
    rua: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567'
  },
  tipo: 'admin',
  avatar: '',
  dataCriacao: new Date('2024-01-01'),
  dataAtualizacao: new Date(),
  ativo: true
});

export default User; 