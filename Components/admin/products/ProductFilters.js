import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const categories = [
  { value: "todas", label: "Todas as Categorias" },
  { value: "roupas_femininas", label: "Roupas Femininas" },
  { value: "roupas_masculinas", label: "Roupas Masculinas" },
  { value: "calcados", label: "Calçados" },
  { value: "acessorios", label: "Acessórios" },
  { value: "bolsas", label: "Bolsas" },
  { value: "infantil", label: "Infantil" },
  { value: "oleos_essenciais", label: "Óleos Essenciais" },
  { value: "mandalas", label: "Mandalas" },
  { value: "artesanato", label: "Artesanato" },
  { value: "gratiluz", label: "Gratiluz" }
];

const statusOptions = [
  { value: "todos", label: "Todos os Status" },
  { value: "disponivel", label: "Disponível" },
  { value: "vendido", label: "Vendido" },
  { value: "reservado", label: "Reservado" }
];

const conditions = [
  { value: "todas", label: "Todas as Condições" },
  { value: "excelente", label: "Excelente" },
  { value: "muito_bom", label: "Muito Bom" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" }
];

export default function ProductFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== "todas" && v !== "todos"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Select value={filters.categoria} onValueChange={value => handleFilterChange("categoria", value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={value => handleFilterChange("status", value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.condicao} onValueChange={value => handleFilterChange("condicao", value)}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map(cond => (
              <SelectItem key={cond.value} value={cond.value}>
                {cond.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="bg-sage-100 text-sage-700">
          {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
}