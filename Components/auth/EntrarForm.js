
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Cliente } from "@/entities/Cliente";
import { User as UserEntity } from "@/entities/User";

export default function EntrarForm() {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.senha) {
      setError("Email e senha são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      console.log("=== INICIANDO LOGIN (MODO DEBUG) ===");
      const emailToSearch = formData.email.toLowerCase().trim();
      console.log("Email para buscar:", emailToSearch);

      // DEBUG: Listar todos os clientes para contornar falha no filtro
      console.log("Listando TODOS os clientes para depuração...");
      const todosOsClientes = await Cliente.list();
      console.log(`Encontrados ${todosOsClientes.length} clientes no total.`);
      
      // Filtrar manualmente no código
      const clienteEncontrado = todosOsClientes.find(cliente => 
        cliente.email && cliente.email.toLowerCase().trim() === emailToSearch
      );

      console.log("Cliente encontrado manualmente:", clienteEncontrado);
      
      if (!clienteEncontrado) {
        console.log("Cliente não encontrado na lista manual. O email pode estar incorreto.");
        setError("Email não encontrado.");
        setLoading(false);
        return;
      }
      
      console.log("Status do cliente:", clienteEncontrado.status);
      if (clienteEncontrado.status !== 'ativo') {
        setError("Conta não foi verificada. Por favor, verifique seu email.");
        setLoading(false);
        return;
      }

      // Verificar senha
      const senhaDigitadaHash = btoa(formData.senha);
      console.log("Comparando senhas...");
      console.log("Senha armazenada (hash):", clienteEncontrado.senha_hash);
      console.log("Senha digitada (hash):", senhaDigitadaHash);

      if (clienteEncontrado.senha_hash !== senhaDigitadaHash) {
        console.log("SENHA INCORRETA!");
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }
      
      console.log("=== LOGIN BEM-SUCEDIDO ===");
      localStorage.setItem('brechoLuliUser', JSON.stringify({
        id: clienteEncontrado.id,
        nome: clienteEncontrado.nome,
        email: clienteEncontrado.email,
        loginTime: Date.now()
      }));

      window.location.href = '/';

    } catch (err) {
      console.error("=== ERRO NO LOGIN ===", err);
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
           <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c3cbe9394_mandala.jpg" 
              alt="Brechó da Luli" 
              className="w-16 h-16 rounded-full mx-auto mb-4 shadow-md"
            />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acessar minha conta
          </CardTitle>
          <p className="text-gray-600 mt-1">
            Que bom te ver de volta!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({...prev, senha: e.target.value}))}
                  placeholder="Sua senha"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link to={createPageUrl('EsqueciSenha')} className="text-sm text-purple-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
              {loading ? "Entrando..." : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Ou</p>
            <Button variant="outline" className="w-full" onClick={() => UserEntity.login()}>
              Continuar com Google
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to={createPageUrl('Cadastro')} className="text-purple-600 hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
