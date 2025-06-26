import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  paga: { label: "Paga", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
};

const tipoLabels = {
  fixa: "Fixa",
  variavel: "Variável",
};

const categoriaLabels = {
    aluguel: "Aluguel",
    contas: "Contas",
    fornecedores: "Fornecedores",
    marketing: "Marketing",
    impostos: "Impostos",
    salarios: "Salários",
    outros: "Outros"
};

export default function DespesasList({ despesas, loading, onEdit, onDelete, onStatusChange }) {
  if (loading) return <div>Carregando despesas...</div>;
  if (!despesas.length) return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
      <p className="text-gray-500">Cadastre sua primeira despesa para começar a monitorar.</p>
    </div>
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
      <CardHeader>
        <CardTitle>Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {despesas.map((despesa) => {
              const status = statusConfig[despesa.status];
              const StatusIcon = status.icon;
              return (
                <TableRow key={despesa.id}>
                  <TableCell>
                    <div className="font-medium">{despesa.descricao}</div>
                    <div className="text-sm text-gray-500">{tipoLabels[despesa.tipo]}</div>
                  </TableCell>
                  <TableCell>R$ {despesa.valor.toFixed(2)}</TableCell>
                  <TableCell>{categoriaLabels[despesa.categoria]}</TableCell>
                  <TableCell>{format(parseISO(despesa.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {despesa.status === 'pendente' && (
                      <Button variant="outline" size="icon" onClick={() => onStatusChange(despesa.id, 'paga')}>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => onEdit(despesa)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(despesa.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}