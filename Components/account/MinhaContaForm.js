import React, { useState, useEffect } from 'react';
import { Cliente } from '@/entities/Cliente';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MinhaContaForm() {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf: ''
  });

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: ''
  });

  useEffect(() => {
    const loadClienteData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('brechoLuliUser'));
        if (!userData || !userData.id) {
          throw new Error("Usuário não encontrado.");
        }
        const clientes = await Cliente.filter({ id: userData.id });
        if (clientes.length === 0) {
          throw new Error("Dados do cliente não encontrados.");
        }
        const clienteData = clientes[0];
        setCliente(clienteData);
        setProfileData({
          nome: clienteData.nome || '',
          email: clienteData.email || '',
          telefone: clienteData.telefone || '',
          endereco: clienteData.endereco || '',
          cpf: clienteData.cpf || ''
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadClienteData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await Cliente.update(cliente.id, {
        nome: profileData.nome,
        telefone: profileData.telefone,
        endereco: profileData.endereco,
        cpf: profileData.cpf
      });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (e) {
      setError("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (passwordData.novaSenha !== passwordData.confirmarNovaSenha) {
      setError("As novas senhas não conferem.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (cliente.senha_hash !== btoa(passwordData.senhaAtual)) {
        throw new Error("A senha atual está incorreta.");
      }
      await Cliente.update(cliente.id, {
        senha_hash: btoa(passwordData.novaSenha)
      });
      setSuccess("Senha alterada com sucesso!");
      setPasswordData({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cliente) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="perfil" className="w-full p-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="perfil">
          <User className="w-4 h-4 mr-2" />
          Informações Pessoais
        </TabsTrigger>
        <TabsTrigger value="senha">
          <Lock className="w-4 h-4 mr-2" />
          Alterar Senha
        </TabsTrigger>
      </TabsList>

      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</motion.div>}
      {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</motion.div>}

      <TabsContent value="perfil">
        <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" value={profileData.nome} onChange={(e) => setProfileData(p => ({ ...p, nome: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profileData.email} disabled />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" value={profileData.telefone} onChange={(e) => setProfileData(p => ({ ...p, telefone: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" value={profileData.endereco} onChange={(e) => setProfileData(p => ({ ...p, endereco: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" value={profileData.cpf} onChange={(e) => setProfileData(p => ({ ...p, cpf: e.target.value }))} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="senha">
        <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="senhaAtual">Senha Atual</Label>
            <Input id="senhaAtual" type="password" value={passwordData.senhaAtual} onChange={(e) => setPasswordData(p => ({ ...p, senhaAtual: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="novaSenha">Nova Senha</Label>
            <Input id="novaSenha" type="password" value={passwordData.novaSenha} onChange={(e) => setPasswordData(p => ({ ...p, novaSenha: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="confirmarNovaSenha">Confirmar Nova Senha</Label>
            <Input id="confirmarNovaSenha" type="password" value={passwordData.confirmarNovaSenha} onChange={(e) => setPasswordData(p => ({ ...p, confirmarNovaSenha: e.target.value }))} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Alterar Senha
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}