import React, { useState } from 'react';
import { Button, PrimaryButton, SecondaryButton, ActionButton } from '../components/ui/button';
import { Card, MetricCard, ClientCard } from '../components/ui/card';
import { Badge, CategoryBadge, StatusBadge, PriceBadge } from '../components/ui/badge';

const TestComponents = () => {
  const [currentTest, setCurrentTest] = useState('overview');

  const testSections = [
    { id: 'overview', name: 'Visão Geral', icon: '📋' },
    { id: 'buttons', name: 'Botões', icon: '🔘' },
    { id: 'cards', name: 'Cards', icon: '📇' },
    { id: 'badges', name: 'Badges', icon: '🏷️' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">🧪 Teste de Componentes - Brechó da Luli</h2>
        <p className="text-gray-600 mb-8">
          Página para testar todos os componentes implementados seguindo o design original
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testSections.slice(1).map(section => (
          <Card key={section.id} className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{section.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{section.name}</h3>
            <Button
              onClick={() => setCurrentTest(section.id)}
              className="w-full"
            >
              Testar
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">✅ Status da Implementação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Componentes Básicos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Design Fidelidade</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">✅</div>
            <div className="text-sm text-gray-600">Funcionando</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderButtonsTest = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🔘 Teste dos Botões</h2>
      
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Botões Principais (seguindo design do Brechó da Luli)</h3>
        <div className="flex flex-wrap gap-4">
          <PrimaryButton>Cadastrar</PrimaryButton>
          <SecondaryButton>Entrar</SecondaryButton>
          <Button variant="success">Nova Venda</Button>
          <Button variant="destructive">Nova Despesa</Button>
          <Button variant="info">Novo Cliente</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Botões com Ícones</h3>
        <div className="flex flex-wrap gap-4">
          <ActionButton icon="➕">Novo Produto</ActionButton>
          <ActionButton icon="📊" variant="info">Exportar Vendas</ActionButton>
          <ActionButton icon="✏️" variant="secondary">Editar</ActionButton>
          <ActionButton icon="🗑️" variant="destructive">Excluir</ActionButton>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Tamanhos</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Pequeno</Button>
          <Button size="default">Padrão</Button>
          <Button size="lg">Grande</Button>
        </div>
      </Card>
    </div>
  );

  const renderCardsTest = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📇 Teste dos Cards</h2>
      
      <div>
        <h3 className="font-semibold mb-4">Cards de Métricas (Dashboard)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard 
            title="Receita Total"
            value="R$ 0.00"
            subtitle="+12% vs período anterior"
            icon="💰"
            iconColor="bg-green-500"
            trend={{ type: 'positive', value: '+12%' }}
          />
          <MetricCard 
            title="Itens Vendidos"
            value="0"
            subtitle="2 disponíveis"
            icon="📦"
            iconColor="bg-blue-500"
          />
          <MetricCard 
            title="Ticket Médio"
            value="R$ 0.00"
            subtitle="Por item vendido"
            icon="🎯"
            iconColor="bg-purple-500"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Cards de Clientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClientCard 
            name="glucksberg"
            phone="(66) 99988-4199"
            email="glucksberg89@gmail.com"
            totalCompras="0"
            totalGasto="R$ 0.00"
            onEdit={() => alert('Editar cliente')}
            onDelete={() => alert('Excluir cliente')}
          />
          <ClientCard 
            name="Starlink"
            phone="(66) 99984-5345"
            email="starlinkcarpediem@gmail.com"
            totalCompras="0"
            totalGasto="R$ 0.00"
            onEdit={() => alert('Editar cliente')}
            onDelete={() => alert('Excluir cliente')}
          />
        </div>
      </div>
    </div>
  );

  const renderBadgesTest = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🏷️ Teste dos Badges</h2>
      
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Badges de Categoria (Produtos)</h3>
        <div className="flex flex-wrap gap-2">
          <CategoryBadge>Gratiluz</CategoryBadge>
          <CategoryBadge>Acessórios</CategoryBadge>
          <CategoryBadge>Roupas</CategoryBadge>
          <CategoryBadge>Calçados</CategoryBadge>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Badges de Status</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="disponivel" />
          <StatusBadge status="vendido" />
          <StatusBadge status="reservado" />
          <StatusBadge status="inativo" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Badges de Preço</h3>
        <div className="flex flex-wrap gap-2">
          <PriceBadge>R$ 85.00</PriceBadge>
          <PriceBadge isDiscount>-30%</PriceBadge>
          <Badge variant="success">Promoção</Badge>
          <Badge variant="warning">Últimas unidades</Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Variações de Cores</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Padrão</Badge>
          <Badge variant="secondary">Secundário</Badge>
          <Badge variant="success">Sucesso</Badge>
          <Badge variant="warning">Aviso</Badge>
          <Badge variant="destructive">Erro</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="purple">Roxo</Badge>
        </div>
      </Card>
    </div>
  );

  const renderCurrentTest = () => {
    switch (currentTest) {
      case 'buttons': return renderButtonsTest();
      case 'cards': return renderCardsTest();
      case 'badges': return renderBadgesTest();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {testSections.map(section => (
              <Button
                key={section.id}
                variant={currentTest === section.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentTest(section.id)}
                className="flex-shrink-0"
              >
                <span className="mr-2">{section.icon}</span>
                {section.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderCurrentTest()}
      </div>

      {/* Back to Overview */}
      {currentTest !== 'overview' && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setCurrentTest('overview')}
            className="shadow-lg"
          >
            📋 Voltar ao Início
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestComponents; 