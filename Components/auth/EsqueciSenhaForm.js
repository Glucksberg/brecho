
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Cliente } from "@/entities/Cliente";
import { SendEmail } from "@/integrations/Core";

export default function EsqueciSenhaForm() {
  const [step, setStep] = useState('form'); // 'form', 'success'
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");

  const generateResetToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFallbackLink("");

    try {
      console.log("=== INÍCIO RECUPERAÇÃO DE SENHA ===");
      console.log("Email solicitado:", email);

      if (!email.trim()) {
        console.log("Email vazio");
        setError("Email é obrigatório");
        setLoading(false);
        return;
      }

      // Buscar TODOS os clientes primeiro para debug
      console.log("Buscando todos os clientes...");
      const todosClientes = await Cliente.list();
      console.log("Total de clientes no banco:", todosClientes.length);
      console.log("Clientes cadastrados:", todosClientes.map(c => ({ 
        id: c.id, 
        email: c.email, 
        nome: c.nome, 
        status: c.status 
      })));

      // Verificar se email existe (com diferentes variações)
      const emailBusca = email.toLowerCase().trim();
      console.log("Procurando pelo email:", emailBusca);
      
      // Buscar de forma mais ampla
      const clientesEncontrados = todosClientes.filter(cliente => 
        cliente.email && cliente.email.toLowerCase().trim() === emailBusca
      );
      
      console.log("Clientes encontrados com o email:", clientesEncontrados);
      
      if (clientesEncontrados.length === 0) {
        console.log("Nenhum cliente encontrado com esse email");
        
        // Mostrar emails similares para debug
        const emailsSimilares = todosClientes
          .filter(c => c.email && c.email.toLowerCase().includes(emailBusca.split('@')[0]))
          .map(c => c.email);
        
        console.log("Emails similares encontrados:", emailsSimilares);
        
        setError("Email não encontrado em nossa base de dados");
        setLoading(false);
        return;
      }

      const cliente = clientesEncontrados[0];
      console.log("Cliente selecionado:", cliente);
      
      // Verificar se cliente está ativo
      if (cliente.status !== 'ativo') {
        console.log("Cliente não está ativo:", cliente.status);
        setError("Conta não está ativa. Complete seu cadastro primeiro.");
        setLoading(false);
        return;
      }
      
      // Gerar token de recuperação
      const resetToken = generateResetToken();
      const tokenExpiracao = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      console.log("Token gerado:", resetToken);
      console.log("Expira em:", tokenExpiracao);

      // Salvar token no cliente
      console.log("Atualizando cliente com token...");
      await Cliente.update(cliente.id, {
        codigo_verificacao: resetToken,
        codigo_expiracao: tokenExpiracao
      });
      console.log("Cliente atualizado com sucesso");

      // Criar link de recuperação
      const resetLink = `${window.location.origin}${createPageUrl('RedefinirSenha')}?token=${resetToken}&email=${encodeURIComponent(email)}`;
      console.log("Link de recuperação criado:", resetLink);

      // Tentar enviar email
      console.log("Tentando enviar email...");
      try {
        await SendEmail({
          to: email,
          subject: "Recuperação de senha - Brechó da Luli",
          body: `
            <h2>Recuperação de Senha</h2>
            <p>Olá ${cliente.nome},</p>
            <p>Você solicitou a recuperação da sua senha no Brechó da Luli.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #7c3aed, #3b82f6); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 10px; 
                        font-weight: bold;
                        display: inline-block;">
                Redefinir Minha Senha
              </a>
            </div>
            <p><strong>Este link expira em 30 minutos.</strong></p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
            <br>
            <p>Atenciosamente,<br>Equipe Brechó da Luli</p>
          `
        });
        console.log("Email de recuperação enviado com sucesso");
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        setFallbackLink(resetLink);
        console.log("Link de recuperação (fallback):", resetLink);
      }

      console.log("=== RECUPERAÇÃO CONCLUÍDA ===");
      setStep('success');

    } catch (error) {
      console.error("=== ERRO NA RECUPERAÇÃO ===");
      console.error("Erro completo:", error);
      console.error("Stack trace:", error.stack);
      setError("Erro ao processar solicitação: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {fallbackLink ? "Link de Recuperação" : "Email enviado!"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {fallbackLink 
                ? "Não foi possível enviar o email. Use o link abaixo:"
                : `Enviamos um link de recuperação para`
              }
              <br/><strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {fallbackLink ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-700 font-medium mb-2">Copie e cole este link no seu navegador:</p>
                <div className="text-sm font-mono text-blue-800 bg-white p-3 rounded border-2 border-blue-300 break-all">
                  {fallbackLink}
                </div>
                <div className="mt-3">
                  <Button 
                    onClick={() => window.open(fallbackLink, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Abrir Link de Recuperação
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Verifique sua caixa de entrada</strong> (e também a pasta de spam).
                  O link expira em 30 minutos.
                </p>
              </div>
            )}

            <div className="text-center space-y-3">
              <Button variant="outline" className="w-full" onClick={() => setStep('form')}>
                Tentar novamente
              </Button>
              
              <Link to={createPageUrl('Entrar')} className="block">
                <Button variant="link" className="w-full text-purple-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
            Esqueceu sua senha?
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>

          <div className="text-center">
            <Link to={createPageUrl('Entrar')} className="inline-flex items-center text-purple-600 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
