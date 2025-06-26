import React from "react";
import { DollarSign, AlertCircle, TrendingDown, Receipt } from "lucide-react";
import StatsCard from "../dashboard/StatsCard";
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function DespesasStats({ despesas }) {
  const calculateStats = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    const despesasMes = despesas.filter(d => isWithinInterval(new Date(d.created_date), { start, end }));

    const totalMes = despesasMes.reduce((sum, d) => sum + d.valor, 0);
    const totalPendente = despesas.filter(d => d.status === 'pendente').reduce((sum, d) => sum + d.valor, 0);
    const totalFixas = despesasMes.filter(d => d.tipo === 'fixa').reduce((sum, d) => sum + d.valor, 0);
    const totalVariaveis = despesasMes.filter(d => d.tipo === 'variavel').reduce((sum, d) => sum + d.valor, 0);

    return { totalMes, totalPendente, totalFixas, totalVariaveis };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Despesas do Mês"
        value={`R$ ${stats.totalMes.toFixed(2)}`}
        icon={DollarSign}
        gradient="from-red-500 to-red-600"
        trend={`Em ${format(new Date(), 'MMMM')}`}
      />
      <StatsCard
        title="Total Pendente"
        value={`R$ ${stats.totalPendente.toFixed(2)}`}
        icon={AlertCircle}
        gradient="from-yellow-500 to-yellow-600"
        trend="Aguardando pagamento"
      />
      <StatsCard
        title="Custos Fixos (mês)"
        value={`R$ ${stats.totalFixas.toFixed(2)}`}
        icon={Receipt}
        gradient="from-blue-500 to-blue-600"
        trend="Recorrentes"
      />
      <StatsCard
        title="Custos Variáveis (mês)"
        value={`R$ ${stats.totalVariaveis.toFixed(2)}`}
        icon={TrendingDown}
        gradient="from-orange-500 to-orange-600"
        trend="Não recorrentes"
      />
    </div>
  );
}