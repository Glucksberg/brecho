import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

const tipos = [
  { value: "fixa", label: "Fixa" },
  { value: "variavel", label: "Variável" },
];

const categorias = [
    { value: "aluguel", label: "Aluguel" },
    { value: "contas", label: "Contas (água, luz, internet)" },
    { value: "fornecedores", label: "Fornecedores" },
    { value: "marketing", label: "Marketing" },
    { value: "impostos", label: "Impostos e Taxas" },
    { value: "salarios", label: "Salários" },
    { value: "outros", label: "Outros" }
];

export default function DespesaForm({ despesa, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    tipo: "variavel",
    categoria: "outros",
    data_vencimento: new Date(),
    status: "pendente",
  });

  useEffect(() => {
    if (despesa) {
      setFormData({
        ...despesa,
        valor: despesa.valor.toString(),
        data_vencimento: parseISO(despesa.data_vencimento),
      });
    }
  }, [despesa]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      valor: parseFloat(formData.valor),
      data_vencimento: format(formData.data_vencimento, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {despesa ? "Editar Despesa" : "Nova Despesa"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleChange('valor', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="data_vencimento">Vencimento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data_vencimento ? format(formData.data_vencimento, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.data_vencimento}
                      onSelect={(date) => handleChange('data_vencimento', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(v) => handleChange('tipo', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {tipos.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(v) => handleChange('categoria', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categorias.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-red-500 to-red-600">
                Salvar Despesa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}