import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend = null, 
  trendValue = null,
  color = 'blue',
  prefix = '',
  suffix = '',
  loading = false
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-900',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-900',
      trend: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-900',
      trend: 'text-purple-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-900',
      trend: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-900',
      trend: 'text-yellow-600'
    },
    gray: {
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      value: 'text-gray-900',
      trend: 'text-gray-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return null;
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colors.bg}`}>
              {Icon && <Icon className={`w-6 h-6 ${colors.icon}`} />}
            </div>
            
            {trend && trendValue && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {TrendIcon && <TrendIcon className="w-4 h-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className={`text-2xl font-bold ${colors.value}`}>
              {prefix}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {value}
              </motion.span>
              {suffix}
            </div>
            
            <div className="text-sm text-gray-600">{title}</div>
            
            {subtitle && (
              <div className="text-xs text-gray-500">{subtitle}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Variações específicas para diferentes tipos de estatísticas
export const SalesStatsCard = ({ vendas, periodo = 'mês' }) => (
  <StatsCard
    title={`Vendas do ${periodo}`}
    value={vendas.total}
    subtitle={`${vendas.quantidade} vendas realizadas`}
    icon={() => <div className="text-2xl">💰</div>}
    trend={vendas.trend}
    trendValue={vendas.trendValue}
    color="green"
    prefix="R$ "
  />
);

export const ProductStatsCard = ({ produtos }) => (
  <StatsCard
    title="Produtos Cadastrados"
    value={produtos.total}
    subtitle={`${produtos.ativos} produtos ativos`}
    icon={() => <div className="text-2xl">📦</div>}
    color="blue"
  />
);

export const ClientStatsCard = ({ clientes }) => (
  <StatsCard
    title="Clientes Cadastrados"
    value={clientes.total}
    subtitle={`${clientes.novos} novos este mês`}
    icon={() => <div className="text-2xl">👥</div>}
    color="purple"
  />
);

export const OrderStatsCard = ({ pedidos }) => (
  <StatsCard
    title="Pedidos Pendentes"
    value={pedidos.pendentes}
    subtitle={`${pedidos.total} pedidos no total`}
    icon={() => <div className="text-2xl">📋</div>}
    color="yellow"
  />
);

export const RevenueStatsCard = ({ receita }) => (
  <StatsCard
    title="Receita do Mês"
    value={receita.valor}
    subtitle={`Meta: R$ ${receita.meta}`}
    icon={() => <div className="text-2xl">📈</div>}
    trend={receita.trend}
    trendValue={receita.trendValue}
    color="green"
    prefix="R$ "
  />
);

export const ConversionStatsCard = ({ conversao }) => (
  <StatsCard
    title="Taxa de Conversão"
    value={conversao.taxa}
    subtitle={`${conversao.visitantes} visitantes`}
    icon={() => <div className="text-2xl">🎯</div>}
    trend={conversao.trend}
    trendValue={conversao.trendValue}
    color="blue"
    suffix="%"
  />
);

export default StatsCard; 