
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, User, Mail, Phone, MapPin, CreditCard, Lock, UserPlus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Cliente } from "@/entities/Cliente";
import { User as UserEntity } from "@/entities/User";
import { SendEmail } from "@/integrations/Core";

export default function CadastroForm({ onCadastroSuccess, isModal = false, preFilledData = {} }) {
  const [step, setStep] = useState('form'); // 'form', 'otp', 'success'
  const [formData, setFormData] = useState({
    nome: preFilledData.nome || "",
    email: preFilledData.email || "",
    telefone: preFilledData.telefone || "",
    endereco: preFilledData.endereco || "",
    cpf: preFilledData.cpf || "",
    senha: "",
    confirmarSenha: "",
    aceitaTermos: false,
    aceitaMarketing: false
  });
  
  const [otpCode, setOtpCode] = useState("");
  const [clienteId, setClienteId] = useState(null);
  const [generatedOTP, setGeneratedOTP] = useState(""); // Para mostrar o OTP quando email falha
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validateForm = () => {
    if (!formData.nome.trim()) return "Nome é obrigatório";
    if (!formData.email.trim()) return "Email é obrigatório";
    if (!formData.telefone.trim()) return "Telefone é obrigatório";
    if (!formData.endereco.trim()) return "Endereço é obrigatório";
    if (!formData.cpf.trim()) return "CPF é obrigatório";
    if (formData.senha.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (formData.senha !== formData.confirmarSenha) return "Senhas não conferem";
    if (!formData.aceitaTermos) return "Você deve aceitar os Termos de Uso";
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email inválido";
    
    return null;
  };

  const formatCPF = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP_Email = async (cliente, otp) => {
    try {
      await SendEmail({
        to: cliente.email,
        subject: "Confirme seu cadastro - Brechó da Luli",
        body: `
          <h2>Bem-vindo ao Brechó da Luli!</h2>
          <p>Olá ${cliente.nome},</p>
          <p>Para concluir seu cadastro, use o código de verificação abaixo:</p>
          <h3 style="color: #7c3aed; font-size: 24px; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 10px;">
            ${otp}
          </h3>
          <p>Este código expira em 10 minutos.</p>
          <p>Se você não se cadastrou no Brechó da Luli, ignore este email.</p>
          <br>
          <p>Atenciosamente,<br>Equipe Brechó da Luli</p>
        `
      });
      console.log("Email com OTP enviado com sucesso para", cliente.email);
      setEmailSent(true);
    } catch (emailError) {
      console.error("Erro ao enviar email de OTP:", emailError);
      setEmailSent(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("=== INÍCIO DO CADASTRO ===");
      console.log("Dados do formulário:", formData);

      // Validar formulário
      const validationError = validateForm();
      if (validationError) {
        console.log("Erro de validação:", validationError);
        setError(validationError);
        setLoading(false);
        return;
      }

      // Verificar se email já existe
      console.log("Verificando se email já existe...");
      const existingClientes = await Cliente.filter({ email: formData.email });
      if (existingClientes.length > 0) {
        console.log("Email já existe:", existingClientes);
        setError("Este email já está cadastrado");
        setLoading(false);
        return;
      }

      // Gerar código OTP
      const codigoOTP = generateOTP();
      const codigoExpiracao = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos

      console.log("Criando cliente com código OTP:", codigoOTP);
      setGeneratedOTP(codigoOTP); // Salvar para mostrar se email falhar

      // Criar dados do cliente
      const clienteData = {
        nome: formData.nome.trim(),
        email: formData.email.toLowerCase().trim(),
        telefone: formData.telefone.trim(),
        endereco: formData.endereco.trim(),
        cpf: formData.cpf.replace(/\D/g, ''),
        senha_hash: btoa(formData.senha), // Base64 encoding simples
        aceita_marketing: formData.aceitaMarketing,
        data_cadastro: new Date().toISOString(),
        fonte_cadastro: "site",
        status: "pendente_verificacao",
        cadastro_completo: true,
        email_verificado: false,
        codigo_verificacao: codigoOTP,
        codigo_expiracao: codigoExpiracao
      };

      console.log("Dados finais para criação:", clienteData);

      // Criar cliente
      const novoCliente = await Cliente.create(clienteData);
      console.log("Cliente criado com sucesso:", novoCliente);

      setClienteId(novoCliente.id);

      // Tentar enviar email com código OTP
      await sendOTP_Email(novoCliente, codigoOTP);

      setStep('otp');
      setResendCooldown(60); // Iniciar cooldown de 60s
      console.log("=== CADASTRO CONCLUÍDO - AGUARDANDO OTP ===");

    } catch (error) {
      console.error("=== ERRO NO CADASTRO ===");
      console.error("Erro completo:", error);
      console.error("Stack trace:", error.stack);
      
      let errorMessage = "Erro ao criar conta. ";
      
      if (error.message) {
        console.error("Mensagem do erro:", error.message);
        errorMessage += error.message;
      } else {
        errorMessage += "Verifique os dados e tente novamente.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");

    try {
        console.log("Reenviando OTP para cliente ID:", clienteId);
        const clientes = await Cliente.filter({ id: clienteId });
        if (clientes.length === 0) {
            setError("Não foi possível encontrar os dados para reenviar o código.");
            setLoading(false);
            return;
        }

        const cliente = clientes[0];
        const novoOTP = generateOTP();
        const novaExpiracao = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        
        await Cliente.update(cliente.id, {
            codigo_verificacao: novoOTP,
            codigo_expiracao: novaExpiracao
        });

        setGeneratedOTP(novoOTP);
        await sendOTP_Email(cliente, novoOTP);
        setResendCooldown(60);

    } catch (error) {
        console.error("Erro ao reenviar OTP:", error);
        setError("Ocorreu um erro ao tentar reenviar o código.");
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("=== VERIFICANDO OTP ===");
      console.log("Código inserido:", otpCode);
      console.log("Cliente ID:", clienteId);

      if (!otpCode || otpCode.length !== 6) {
        setError("Por favor, insira o código de 6 dígitos");
        setLoading(false);
        return;
      }

      // Buscar cliente
      const cliente = await Cliente.filter({ id: clienteId });
      if (cliente.length === 0) {
        setError("Cliente não encontrado");
        setLoading(false);
        return;
      }

      const clienteData = cliente[0];

      // Verificar se código expirou
      if (new Date() > new Date(clienteData.codigo_expiracao)) {
        setError("Código expirado. Solicite um novo código.");
        setLoading(false);
        return;
      }

      // Verificar código
      if (clienteData.codigo_verificacao !== otpCode) {
        setError("Código incorreto. Tente novamente.");
        setLoading(false);
        return;
      }

      // Ativar conta
      await Cliente.update(clienteId, {
        status: "ativo",
        email_verificado: true,
        codigo_verificacao: null,
        codigo_expiracao: null
      });

      console.log("=== CONTA ATIVADA COM SUCESSO ===");
      setStep('success');

    } catch (error) {
      console.error("Erro ao verificar OTP:", error);
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Salvar sessão
    localStorage.setItem('brechoLuliUser', JSON.stringify({
      id: clienteId,
      nome: formData.nome,
      email: formData.email,
      loginTime: Date.now()
    }));

    if (onCadastroSuccess) {
      onCadastroSuccess({ id: clienteId, nome: formData.nome, email: formData.email });
    } else {
      window.location.href = '/';
    }
  };

  const containerClass = isModal 
    ? "w-full max-w-md mx-auto" 
    : "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50";

  if (step === 'otp') {
    return (
      <div className={containerClass}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Verifique seu email
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {emailSent ? (
                  <>
                    Enviamos um código de 6 dígitos para<br />
                    <strong>{formData.email}</strong>. Verifique sua caixa de spam.
                  </>
                ) : (
                  <>
                    Não foi possível enviar o email.<br />
                    <strong>Use o código abaixo:</strong>
                  </>
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!emailSent && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-blue-700 font-medium mb-2">Código de verificação:</p>
                  <div className="text-3xl font-bold text-blue-800 tracking-widest bg-white p-3 rounded border-2 border-blue-300">
                    {generatedOTP}
                  </div>
                  <p className="text-blue-600 text-sm mt-2">
                    Copie e cole este código no campo abaixo
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <Label htmlFor="otpCode">Código de verificação</Label>
                  <Input
                    id="otpCode"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || otpCode.length !== 6}>
                  {loading && !resendCooldown ? "Verificando..." : "Verificar código"}
                </Button>
              </form>

              <div className="text-center text-sm space-y-2">
                <Button variant="link" onClick={handleResendOTP} disabled={resendCooldown > 0 || loading} className="text-purple-600">
                    {resendCooldown > 0 ? `Aguarde ${resendCooldown}s para reenviar` : "Reenviar código"}
                </Button>
                <Separator />
                 <Button
                  variant="link"
                  onClick={() => setStep('form')}
                  className="text-gray-500"
                >
                  Usar outro email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={containerClass}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Conta criada com sucesso!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Bem-vindo ao Brechó da Luli, {formData.nome}!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                Entrar na minha conta
              </Button>
              
              <div className="text-center">
                <Link to={createPageUrl('Home')} className="text-purple-600 hover:underline">
                  Ir para a loja
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c3cbe9394_mandala.jpg" 
              alt="Brechó da Luli" 
              className="w-16 h-16 rounded-full mx-auto mb-4 shadow-md"
            />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Criar sua conta
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Junte-se ao Brechó da Luli
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="telefone">Celular *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))}
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço de entrega *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({...prev, endereco: e.target.value}))}
                    placeholder="Rua, número, bairro, cidade - estado"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({...prev, cpf: formatCPF(e.target.value)}))}
                    placeholder="000.000.000-00"
                    className="pl-10"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="senha">Senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) => setFormData(prev => ({...prev, senha: e.target.value}))}
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
                <Label htmlFor="confirmarSenha">Repetir senha *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData(prev => ({...prev, confirmarSenha: e.target.value}))}
                    placeholder="Confirme sua senha"
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

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, aceitaTermos: checked}))}
                  />
                  <Label htmlFor="aceitaTermos" className="text-sm leading-5">
                    Eu aceito os <Link to="#" className="text-purple-600 hover:underline">Termos de Uso</Link> e a <Link to="#" className="text-purple-600 hover:underline">Política de Privacidade</Link>*
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="aceitaMarketing"
                    checked={formData.aceitaMarketing}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, aceitaMarketing: checked}))}
                  />
                  <Label htmlFor="aceitaMarketing" className="text-sm leading-5">
                    Quero receber ofertas especiais por email e WhatsApp (opcional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600" disabled={loading}>
                {loading ? "Criando conta..." : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar conta
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
                Já tem uma conta?{" "}
                <Link to={createPageUrl('Entrar')} className="text-purple-600 hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
