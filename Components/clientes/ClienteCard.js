import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Phone, Mail, Instagram, ShoppingBag, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function ClienteCard({ cliente, stats, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-sage-100/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-xl">{cliente.nome}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                {cliente.telefone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {cliente.telefone}</span>
                )}
                {cliente.email && (
                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {cliente.email}</span>
                )}
                {cliente.instagram && (
                  <span className="flex items-center gap-1.5"><Instagram className="w-3 h-3" /> @{cliente.instagram}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-sage-50/50 rounded-lg mb-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600"><ShoppingBag className="w-4 h-4" /> Total de Compras</span>
                <span className="font-semibold text-gray-900">{stats.compras}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-gray-600"><DollarSign className="w-4 h-4" /> Total Gasto</span>
                <span className="font-semibold text-green-700">R$ {stats.totalGasto.toFixed(2)}</span>
            </div>
          </div>
          
          {cliente.observacoes && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded">
                  <p className="text-sm text-yellow-800">{cliente.observacoes}</p>
              </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 hover:bg-sage-50 border-sage-200"
              onClick={() => onEdit(cliente)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              className="flex-1 hover:bg-red-50 text-red-600 border-red-200"
              onClick={() => onDelete(cliente.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}