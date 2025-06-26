import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

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

export default function CategoryChart({ produtos }) {
  const categoryData = Object.values(produtos.reduce((acc, produto) => {
    const categoria = produto.categoria || 'outros';
    const nome = categoryLabels[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
    
    if (!acc[categoria]) {
      acc[categoria] = {
        nome,
        total: 0,
        disponivel: 0,
        vendido: 0,
      };
    }
    
    acc[categoria].total++;
    if (produto.status === 'disponivel') acc[categoria].disponivel++;
    if (produto.status === 'vendido') acc[categoria].vendido++;
    
    return acc;
  }, {}));

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <TrendingUp className="w-5 h-5" />
          Produtos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="nome" 
                  type="category"
                  tick={{ fontSize: 12, width: 90 }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'rgba(232, 242, 232, 0.5)' }}
                />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="disponivel" stackId="a" fill="#7c9a7c" name="Disponível" />
                <Bar dataKey="vendido" stackId="a" fill="#d1e7d1" name="Vendido"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Nenhum dado para exibir</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}