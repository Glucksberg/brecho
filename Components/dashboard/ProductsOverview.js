import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

const statusLabels = {
  disponivel: "Disponível",
  vendido: "Vendido",
  reservado: "Reservado"
};

const statusColors = {
  disponivel: "bg-green-100 text-green-800",
  vendido: "bg-gray-100 text-gray-800",
  reservado: "bg-yellow-100 text-yellow-800"
};

const categoryLabels = {
  roupas_femininas: "Roupas Femininas",
  roupas_masculinas: "Roupas Masculinas",
  calcados: "Calçados",
  acessorios: "Acessórios",
  bolsas: "Bolsas",
  infantil: "Infantil",
  oleos_essenciais: "Óleos Essenciais",
  mandalas: "Mandalas",
  artesanato: "Artesanato",
  gratiluz: "Gratiluz"
};

export default function ProductsOverview({ produtos, loading }) {
  const groupedByStatus = produtos.reduce((acc, produto) => {
    const status = produto.status || 'disponivel';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const recentProducts = produtos
    .filter(p => p.status === 'disponivel')
    .slice(0, 5);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Package className="w-5 h-5" />
          Visão Geral dos Produtos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {Object.entries(groupedByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <Badge className={statusColors[status]}>
                {statusLabels[status]}
              </Badge>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            Últimos produtos disponíveis
          </h4>
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((produto, index) => (
                <motion.div
                  key={produto.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-sage-50/50 hover:bg-sage-50 transition-colors duration-200"
                >
                  <h5 className="font-medium text-gray-900 truncate">{produto.nome}</h5>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{categoryLabels[produto.categoria] || produto.categoria?.replace(/_/g, ' ') || 'Sem categoria'}</span>
                    <span className="font-semibold text-sage-600">
                      R$ {produto.preco_venda?.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum produto disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}