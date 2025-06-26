
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Cliente } from "@/entities/Cliente";

export default function RedefinirSenhaForm() {
  const [step, setStep] = useState('loading'); // 'loading', 'form', 'success', 'error'
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [cliente, setCliente] = useState(null);
  const [passwords, setPasswords] = useState({
    novaSenha: "",
    confirmarSenha: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlEmail = urlParams.get('email');

      console.log("=== VALIDANDO TOKEN DE RECUPERAÇÃO ===");
      console.log("Token da URL:", urlToken);
      console.log("Email da URL:", urlEmail);

      if (!urlToken || !urlEmail) {
        console.log("Token ou email ausente na URL");
        setStep('error');
        setError("Link inválido ou malformado.");
        return;
      }

      setToken(urlToken);
      setEmail(urlEmail);

      // Buscar cliente pelo TOKEN (mais robusto)
      console.log("Buscando cliente por token...");
      const clientes = await Cliente.filter({ codigo_verificacao: urlToken });
      console.log("Clientes encontrados com o token:", clientes);
      
      if (clientes.length === 0) {
        console.log("Nenhum cliente encontrado com este token.");
        setStep('error');
        setError("Link inválido ou já utilizado.");
        return;
      }

      const clienteData = clientes[0];
      console.log("Cliente encontrado:", clienteData);

      // Segurança extra: verificar se o email do cliente encontrado bate com o email da URL
      if (clienteData.email.toLowerCase() !== urlEmail.toLowerCase()) {
          console.log("Divergência de email! Token válido, mas email não confere.");
          setStep('error');
          setError("Erro de segurança. O link de recuperação não pertence a este email.");
          return;
      }

      // Verificar se token não expirou
      if (!clienteData.codigo_expiracao || new Date() > new Date(clienteData.codigo_expiracao)) {
        console.log("Token expirado:", clienteData.codigo_expiracao);
        setStep('error');
        setError("Link expirado. Solicite uma nova recuperação de senha.");
        return;
      }

      console.log("Token válido! Mostrando formulário de nova senha");
      setCliente(clienteData);
      setStep('form');

    } catch (error) {
      console.error("Erro ao validar token:", error);
      setStep('error');
      setError("Erro ao verificar link de recuperação.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("=== REDEFININDO SENHA ===");
      
      if (passwords.novaSenha.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        setLoading(false);
        return;
      }

      if (passwords.novaSenha !== passwords.confirmarSenha) {
        setError("As senhas não conferem");
        setLoading(false);
        return;
      }

      // Atualizar senha e limpar token
      await Cliente.update(cliente.id, {
        senha_hash: btoa(passwords.novaSenha),
        codigo_verificacao: null,
        codigo_expiracao: null
      });

      console.log("Senha redefinida com sucesso!");
      setStep('success');

    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      setError("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando link...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
              Senha redefinida!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sua senha foi alterada com sucesso.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to={createPageUrl('Entrar')} className="block">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                Fazer login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (step === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Link inválido
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {error}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to={createPageUrl('EsqueciSenha')} className="block">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                Solicitar nova recuperação
              </Button>
            </Link>
            
            <Link to={createPageUrl('Entrar')} className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao login
              </Button>
            </Link>
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
            Redefinir senha
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Digite sua nova senha para <strong>{email}</strong>
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
              <Label htmlFor="novaSenha">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="novaSenha"
                  type={showPassword ? "text" : "password"}
                  value={passwords.novaSenha}
                  onChange={(e) => setPasswords(prev => ({...prev, novaSenha: e.target.value}))}
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmarSenha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirmarSenha}
                  onChange={(e) => setPasswords(prev => ({...prev, confirmarSenha: e.target.value}))}
                  placeholder="Confirme sua nova senha"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
