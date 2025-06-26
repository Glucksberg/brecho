
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Tag, Shirt, ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  disponivel: "bg-green-100 text-green-800 border-green-200",
  vendido: "bg-gray-100 text-gray-800 border-gray-200",
  reservado: "bg-yellow-100 text-yellow-800 border-yellow-200"
};

const statusLabels = {
  disponivel: "Disponível",
  vendido: "Vendido",  
  reservado: "Reservado"
};

const statusIcons = {
  disponivel: CheckCircle,
  vendido: ShoppingCart,
  reservado: Clock
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

const conditionLabels = {
  excelente: "Excelente",
  muito_bom: "Muito Bom",
  bom: "Bom",
  regular: "Regular"
};

export default function ProductCard({ product, onEdit, onStatusChange }) {
  const StatusIcon = statusIcons[product.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-sage-100/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-sage-50 to-beige-50 flex items-center justify-center relative">
          {product.foto_url ? (
            <img 
              src={product.foto_url} 
              alt={product.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <Shirt className="w-16 h-16 text-sage-300" />
          )}
          <div className="absolute top-3 right-3">
            <Badge className={`${statusColors[product.status]} border flex items-center gap-1`}>
              {StatusIcon && <StatusIcon className="w-3 h-3" />}
              {statusLabels[product.status]}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
              {product.nome}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-3 h-3" />
              <span>{categoryLabels[product.categoria] || product.categoria}</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {product.marca && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Marca:</span>
                <span className="font-medium">{product.marca}</span>
              </div>
            )}
            {product.tamanho && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tamanho:</span>
                <span className="font-medium">{product.tamanho}</span>
              </div>
            )}
            {product.condicao && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Condição:</span>
                <span className="font-medium">{conditionLabels[product.condicao]}</span>
              </div>
            )}
            {product.codigo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Código:</span>
                <span className="font-mono text-xs">{product.codigo}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                R$ {product.preco_venda?.toFixed(2)}
              </p>
              {product.preco_compra && (
                <p className="text-sm text-gray-500">
                  Custo: R$ {product.preco_compra.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full hover:bg-sage-50 border-sage-200"
              onClick={() => onEdit(product)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            {product.status === 'disponivel' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                  onClick={() => onStatusChange(product.id, 'reservado')}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Reservar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => onStatusChange(product.id, 'vender')}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Vender
                </Button>
              </div>
            )}

            {product.status === 'reservado' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => onStatusChange(product.id, 'disponivel')}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Disponível
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => onStatusChange(product.id, 'vender')}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Vender
                </Button>
              </div>
            )}

            {product.status === 'vendido' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={() => onStatusChange(product.id, 'disponivel')}
              >
                <CheckCircle className="w-3 h-3 mr-2" />
                Marcar como Disponível
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
