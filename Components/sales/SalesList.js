
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, User, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";

const paymentMethodColors = {
  dinheiro: "bg-green-100 text-green-800",
  pix: "bg-purple-100 text-purple-800",
  cartao_debito: "bg-blue-100 text-blue-800",
  cartao_credito: "bg-orange-100 text-orange-800"
};

const paymentMethodLabels = {
  dinheiro: "Dinheiro",
  pix: "PIX",
  cartao_debito: "Cartão Débito",
  cartao_credito: "Cartão Crédito"
};

export default function SalesList({ vendas, loading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Histórico de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-sage-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-sage-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : vendas.length > 0 ? (
          <div className="space-y-4">
            {vendas.map((venda, index) => (
              <motion.div
                key={venda.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border border-sage-100 rounded-xl hover:bg-sage-50/50 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                      {venda.produto_nome}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(venda.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                      {venda.cliente_nome && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {venda.cliente_nome}
                        </span>
                      )}
                      <Badge className={`${paymentMethodColors[venda.forma_pagamento]} flex items-center gap-1`}>
                        <CreditCard className="w-3 h-3" />
                        {paymentMethodLabels[venda.forma_pagamento]}
                      </Badge>
                    </div>
                    {venda.observacoes && (
                      <div className="mt-2 p-2 bg-sage-50 rounded text-sm text-gray-700">
                        {venda.observacoes}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      R$ {venda.valor_venda?.toFixed(2)}
                    </div>
                    {venda.desconto > 0 && (
                      <div className="text-sm text-red-600">
                        Desconto: R$ {venda.desconto.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-sage-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma venda registrada
            </h3>
            <p className="text-gray-500">
              Quando você registrar vendas, elas aparecerão aqui.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
