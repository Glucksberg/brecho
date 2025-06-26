import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Download, Upload, DatabaseBackup, History, AlertTriangle, Loader2, Trash2, DatabaseZap } from "lucide-react";
import { motion } from "framer-motion";

// Import all entities
import { Produto } from "@/entities/Produto";
import { Venda } from "@/entities/Venda";
import { Cliente } from "@/entities/Cliente";
import { Despesa } from "@/entities/Despesa";

export default function Configuracoes() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const fileInputRef = useRef(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const [produtos, vendas, clientes, despesas] = await Promise.all([
        Produto.list(),
        Venda.list(),
        Cliente.list(),
        Despesa.list()
      ]);

      const backupData = {
        produtos,
        vendas,
        clientes,
        despesas,
        backupDate: new Date().toISOString()
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `backup-brecho-luli-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erro ao criar backup:", error);
      alert("Ocorreu um erro ao gerar o backup. Tente novamente.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const confirmation = window.confirm(
      "ATENÇÃO! Esta ação é IRREVERSÍVEL.\n\n" +
      "Todos os dados atuais (produtos, vendas, clientes, despesas) serão APAGADOS e substituídos pelo conteúdo do arquivo de backup.\n\n" +
      "Deseja continuar?"
    );

    if (!confirmation) {
      fileInputRef.current.value = ""; // Reset file input
      return;
    }

    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate backup file structure
        if (!data.produtos || !data.vendas || !data.clientes || !data.despesas) {
          throw new Error("Arquivo de backup inválido ou corrompido.");
        }

        // Delete existing data
        const entities = [Produto, Venda, Cliente, Despesa];
        for (const entity of entities) {
          const records = await entity.list();
          for (const record of records) {
            await entity.delete(record.id);
          }
        }
        
        // Restore new data
        await Produto.bulkCreate(data.produtos || []);
        await Venda.bulkCreate(data.vendas || []);
        await Cliente.bulkCreate(data.clientes || []);
        await Despesa.bulkCreate(data.despesas || []);

        alert("Restauração concluída com sucesso! A página será recarregada.");
        window.location.reload();

      } catch (error) {
        console.error("Erro ao restaurar backup:", error);
        alert(`Ocorreu um erro ao restaurar o backup: ${error.message}`);
      } finally {
        setIsRestoring(false);
        fileInputRef.current.value = ""; // Reset file input
      }
    };
    reader.readAsText(file);
  };

  const deleteAllData = async () => {
    const entities = [Produto, Venda, Cliente, Despesa];
    for (const entity of entities) {
      const records = await entity.list();
      // Deletar em lotes pode ser mais eficiente, mas um por um é mais seguro para limites de API
      for (const record of records) {
        await entity.delete(record.id);
      }
    }
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setIsDeleteDialogOpen(false); // Close dialog immediately
    try {
      await deleteAllData();
      alert("Todos os dados foram excluídos com sucesso! A página será recarregada.");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir todos os dados:", error);
      alert(`Ocorreu um erro ao excluir os dados: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmationInput(""); // Clear confirmation input
    }
  };

  const handlePopulate = async () => {
    if (!window.confirm("Tem certeza? Esta ação apagará TODOS os dados atuais e os substituirá por dados de demonstração simples.")) {
      return;
    }
    setIsPopulating(true);
    try {
      await deleteAllData();

      // Criar dados simples de demonstração
      const sampleClientes = await Cliente.bulkCreate([
        { nome: "Ana Silva", telefone: "(11) 99999-1111", email: "ana@exemplo.com" },
        { nome: "Carlos Pereira", telefone: "(11) 99999-2222", instagram: "@carlos_p" },
        { nome: "Maria Santos", telefone: "(11) 99999-3333" },
        { nome: "João Oliveira", telefone: "(11) 99999-4444", email: "joao@exemplo.com" }
      ]);

      const sampleProdutos = await Produto.bulkCreate([
        { nome: "Vestido Floral", categoria: "roupas_femininas", tamanho: "M", preco_compra: 25.0, preco_venda: 60.0, condicao: "excelente", status: "disponivel", codigo: "BR001" },
        { nome: "Calça Jeans Masculina", categoria: "roupas_masculinas", tamanho: "42", preco_compra: 30.0, preco_venda: 75.0, condicao: "muito_bom", status: "disponivel", codigo: "BR002" },
        { nome: "Bolsa de Couro", categoria: "bolsas", marca: "Marca Famosa", preco_compra: 50.0, preco_venda: 120.0, condicao: "bom", status: "disponivel", codigo: "BR003" },
        { nome: "Sapato Scarpin", categoria: "calcados", tamanho: "37", preco_compra: 20.0, preco_venda: 55.0, condicao: "excelente", status: "disponivel", codigo: "BR004" },
        { nome: "Camisa Social", categoria: "roupas_masculinas", tamanho: "G", preco_compra: 15.0, preco_venda: 45.0, condicao: "muito_bom", status: "disponivel", codigo: "BR005" },
        { nome: "Saia Midi", categoria: "roupas_femininas", tamanho: "P", preco_compra: 20.0, preco_venda: 50.0, condicao: "excelente", status: "disponivel", codigo: "BR006" },
        { nome: "Tênis Esportivo", categoria: "calcados", tamanho: "40", preco_compra: 35.0, preco_venda: 85.0, condicao: "bom", status: "vendido", codigo: "BR007" },
        { nome: "Blazer Feminino", categoria: "roupas_femininas", tamanho: "M", preco_compra: 40.0, preco_venda: 95.0, condicao: "excelente", status: "vendido", codigo: "BR008" }
      ]);

      // Criar algumas vendas dos produtos vendidos
      const produtoTenis = sampleProdutos.find(p => p.codigo === 'BR007');
      const produtoBlazer = sampleProdutos.find(p => p.codigo === 'BR008');

      await Venda.bulkCreate([
        { 
          produto_id: produtoTenis.id, 
          produto_nome: produtoTenis.nome, 
          valor_venda: 85.0, 
          forma_pagamento: "pix", 
          cliente_id: sampleClientes[0].id, 
          cliente_nome: sampleClientes[0].nome,
          data_venda: "2024-11-01"
        },
        { 
          produto_id: produtoBlazer.id, 
          produto_nome: produtoBlazer.nome, 
          valor_venda: 90.0, 
          desconto: 5.0, 
          forma_pagamento: "cartao_credito", 
          cliente_id: sampleClientes[1].id, 
          cliente_nome: sampleClientes[1].nome,
          data_venda: "2024-11-15"
        }
      ]);

      await Despesa.bulkCreate([
        { descricao: "Aluguel da Loja", valor: 800.0, tipo: "fixa", categoria: "aluguel", data_vencimento: "2024-12-05", status: "paga" },
        { descricao: "Conta de Luz", valor: 120.0, tipo: "fixa", categoria: "contas", data_vencimento: "2024-12-10", status: "pendente" },
        { descricao: "Marketing Instagram", valor: 200.0, tipo: "variavel", categoria: "marketing", data_vencimento: "2024-11-30", status: "paga" },
        { descricao: "Compra de Sacolas", valor: 50.0, tipo: "variavel", categoria: "fornecedores", data_vencimento: "2024-12-01", status: "pendente" }
      ]);

      alert("Dados de demonstração criados com sucesso! A página será recarregada.");
      window.location.reload();

    } catch (error) {
      console.error("Erro ao popular dados:", error);
      alert(`Ocorreu um erro ao popular os dados: ${error.message}`);
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #faf9f7 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Configurações
          </h1>
          <p className="text-sage-600">Gerencie os dados e o comportamento do seu sistema.</p>
        </motion.div>

        <div className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-sage-100/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <DatabaseBackup className="w-6 h-6" />
                Backup dos Dados
              </CardTitle>
              <CardDescription>
                Faça o download de um arquivo com todos os dados do seu brechó. 
                Guarde este arquivo em um local seguro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackup} disabled={isBackingUp || isPopulating}>
                {isBackingUp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Fazer Backup Agora
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <History className="w-6 h-6" />
                Restaure Dados
              </CardTitle>
              <CardDescription>
                Restaure o sistema a partir de um arquivo de backup.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Atenção: Ação Destrutiva</h3>
                    <div className="mt-2 text-sm">
                      <p>
                        Esta ação substituirá permanentemente TODOS os dados existentes no sistema. 
                        Use com cuidado e apenas se tiver certeza.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRestore}
                accept=".json"
                className="hidden"
                disabled={isRestoring || isPopulating}
              />
              <Button 
                variant="destructive" 
                onClick={() => fileInputRef.current.click()} 
                disabled={isRestoring || isPopulating}
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Restaurando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Arquivo e Restaurar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <DatabaseZap className="w-6 h-6" />
                Dados de Demonstração
              </CardTitle>
              <CardDescription>
                Apague todos os dados atuais e povoe o sistema com alguns dados fictícios para demonstração ou teste.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button onClick={handlePopulate} disabled={isPopulating || isRestoring || isDeleting} variant="outline">
                {isPopulating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando dados...
                  </>
                ) : (
                  <>
                    <DatabaseZap className="mr-2 h-4 w-4" />
                    Povoar com Dados Fictícios
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-red-700">
                <Trash2 className="w-6 h-6" />
                Excluir Todos os Dados
              </CardTitle>
              <CardDescription>
                Esta ação é irreversível e excluirá permanentemente todos os produtos, vendas, clientes e despesas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting || isPopulating || isRestoring}
              >
                {isDeleting ? (
                   <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Dados do Sistema
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Você tem certeza absoluta?</DialogTitle>
            <DialogDescription className="text-base">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os dados do seu brechó.
              <br/><br/>
              Para confirmar, digite <strong>EXCLUIR TUDO</strong> no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirm" className="sr-only">Confirmar exclusão</Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="EXCLUIR TUDO"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteDialogOpen(false); setDeleteConfirmationInput(""); }}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={deleteConfirmationInput !== "EXCLUIR TUDO" || isDeleting}
            >
              {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eu entendo as consequências, excluir tudo
                  </>
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}