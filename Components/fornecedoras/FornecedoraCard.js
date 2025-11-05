import React from 'react';
import { User, Phone, Mail, TrendingUp, Package, DollarSign } from 'lucide-react';

export default function FornecedoraCard({ fornecedora, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(fornecedora)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{fornecedora.nome}</h3>
            <p className="text-sm text-gray-500">{fornecedora.percentualRepasse}% de repasse</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          fornecedora.ativo
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {fornecedora.ativo ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      {/* Contato */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        {fornecedora.telefone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{fornecedora.telefone}</span>
          </div>
        )}
        {fornecedora.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{fornecedora.email}</span>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Produtos Ativos</p>
            <p className="font-semibold">{fornecedora.totalProdutosAtivos}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Vendidos</p>
            <p className="font-semibold">{fornecedora.totalProdutosVendidos}</p>
          </div>
        </div>
      </div>

      {/* Créditos */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Crédito Disponível:</span>
          <span className="font-bold text-green-700">
            {fornecedora.getFormattedCreditoDisponivel()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Crédito Pendente:</span>
          <span className="font-semibold text-orange-600">
            {fornecedora.getFormattedCreditoPendente()}
          </span>
        </div>
      </div>

      {/* Classificação */}
      <div className="mt-4 text-center">
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
          fornecedora.getClassificacao() === 'VIP' ? 'bg-purple-100 text-purple-700' :
          fornecedora.getClassificacao() === 'Premium' ? 'bg-blue-100 text-blue-700' :
          fornecedora.getClassificacao() === 'Regular' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {fornecedora.getClassificacao()}
        </span>
      </div>
    </div>
  );
}
