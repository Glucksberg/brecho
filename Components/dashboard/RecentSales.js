import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingBag, Calendar, CreditCard } from "lucide-react";
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

export default function RecentSales({ vendas, loading }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <ShoppingBag className="w-5 h-5" />
          Vendas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
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
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-sage-50/50 hover:bg-sage-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{venda.produto_nome}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(venda.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {venda.cliente_nome && (
                      <span>Cliente: {venda.cliente_nome}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    R$ {venda.valor_venda?.toFixed(2)}
                  </p>
                  {venda.forma_pagamento && <Badge className={`mt-1 ${paymentMethodColors[venda.forma_pagamento]}`}>
                    {paymentMethodLabels[venda.forma_pagamento]}
                  </Badge>}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-sage-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma venda registrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}