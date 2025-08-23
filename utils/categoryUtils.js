// Utilitários para categorias do Brechó da Luli

export const categories = {
  vestidos: {
    id: 'vestidos',
    name: 'Vestidos',
    slug: 'vestidos',
    description: 'Peças únicas para ocasiões especiais',
    keywords: ['vestido', 'dress', 'festa', 'casual', 'formal']
  },
  blazers: {
    id: 'blazers',
    name: 'Blazers',
    slug: 'blazers',
    description: 'Elegância profissional e casual',
    keywords: ['blazer', 'casaco', 'trabalho', 'formal', 'elegante']
  },
  acessorios: {
    id: 'acessorios',
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Detalhes que fazem a diferença',
    keywords: ['acessório', 'joia', 'bolsa', 'cinto', 'óculos']
  },
  bolsas: {
    id: 'bolsas',
    name: 'Bolsas',
    slug: 'bolsas',
    description: 'Estilo e funcionalidade em cada peça',
    keywords: ['bolsa', 'mochila', 'carteira', 'clutch', 'shoulder']
  },
  saias: {
    id: 'saias',
    name: 'Saias',
    slug: 'saias',
    description: 'Feminilidade e versatilidade',
    keywords: ['saia', 'midi', 'longa', 'curta', 'plissada']
  },
  calcados: {
    id: 'calcados',
    name: 'Calçados',
    slug: 'calcados',
    description: 'Conforto e estilo para seus pés',
    keywords: ['sapato', 'tênis', 'sandália', 'bota', 'salto']
  }
};

/**
 * Busca categoria por ID
 * @param {string} categoryId 
 * @returns {object|null}
 */
export const getCategoryById = (categoryId) => {
  return categories[categoryId] || null;
};

/**
 * Busca categoria por slug
 * @param {string} slug 
 * @returns {object|null}
 */
export const getCategoryBySlug = (slug) => {
  return Object.values(categories).find(cat => cat.slug === slug) || null;
};

/**
 * Retorna todas as categorias como array
 * @returns {array}
 */
export const getAllCategories = () => {
  return Object.values(categories);
};

/**
 * Filtra produtos por categoria
 * @param {array} produtos 
 * @param {string} categoryId 
 * @returns {array}
 */
export const filterProductsByCategory = (produtos, categoryId) => {
  if (!categoryId || categoryId === 'all') return produtos;
  
  const category = getCategoryById(categoryId);
  if (!category) return produtos;

  return produtos.filter(produto => {
    // Verifica se a categoria do produto corresponde
    if (produto.categoria === categoryId) return true;
    
    // Verifica se alguma palavra-chave da categoria está no nome ou descrição
    const searchText = `${produto.nome} ${produto.descricao || ''}`.toLowerCase();
    return category.keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  });
};

/**
 * Gera URL para categoria
 * @param {string} categoryId 
 * @returns {string}
 */
export const getCategoryUrl = (categoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return '/Produtos';
  
  return `/Produtos?categoria=${category.slug}`;
};

/**
 * Estatísticas das categorias (mock para demonstração)
 * @returns {object}
 */
export const getCategoryStats = () => {
  return {
    vestidos: { count: 120, trend: '+15%', popular: true },
    blazers: { count: 85, trend: '+8%', popular: false },
    acessorios: { count: 200, trend: '+22%', popular: true },
    bolsas: { count: 95, trend: '+12%', popular: false },
    saias: { count: 75, trend: '+18%', popular: true },
    calcados: { count: 110, trend: '+7%', popular: false }
  };
};

export default {
  categories,
  getCategoryById,
  getCategoryBySlug,
  getAllCategories,
  filterProductsByCategory,
  getCategoryUrl,
  getCategoryStats
}; 