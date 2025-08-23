import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Star, 
  ArrowRight,
  Store,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function TestNavbar() {
  const [currentUser, setCurrentUser] = useState(null);

  // Simular login/logout
  const handleLogin = () => {
    setCurrentUser({
      nome: 'Maria Silva',
      email: 'maria@example.com',
      avatar: null
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Conteúdo da página de teste */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Teste do Navbar
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Brechó da Luli - Moda que Reconta Histórias
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">Navbar implementado com sucesso!</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card de Funcionalidades */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Funcionalidades do Navbar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Logo "Brechó da Luli" com ícone</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Menu: Início, Produtos, Favoritos, Sobre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Carrinho com contador</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Botões Entrar/Cadastrar roxos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Responsivo para mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Announcement bar com gradiente</span>
              </div>
            </CardContent>
          </Card>

          {/* Card de Teste de Login */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Teste de Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Teste o sistema de login/logout do navbar:
              </p>
              
              {currentUser ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      Logado como: {currentUser.nome}
                    </p>
                    <p className="text-xs text-green-600">{currentUser.email}</p>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                  >
                    Fazer Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Usuário não logado</p>
                  </div>
                  <Button 
                    onClick={handleLogin}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Simular Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card de Cores e Design */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Design System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Cores Principais:</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow"></div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white shadow"></div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white shadow"></div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Badges de Exemplo:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="purple">Roxo</Badge>
                  <Badge variant="sage">Verde</Badge>
                  <Badge variant="secondary">Secundário</Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Botões:</p>
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Primário
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Secundário
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Navegação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Teste a Navegação
          </h2>
          <p className="text-gray-600 mb-8">
            Clique nos links do navbar para testar a navegação entre as páginas
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Início</h3>
                <p className="text-sm text-gray-500">Página inicial</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Produtos</h3>
                <p className="text-sm text-gray-500">Catálogo</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Favoritos</h3>
                <p className="text-sm text-gray-500">Lista de desejos</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Sobre</h3>
                <p className="text-sm text-gray-500">Nossa história</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl font-bold mb-4">
            Navbar Implementado! ✨
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            O navbar do Brechó da Luli está funcionando perfeitamente. 
            Agora podemos continuar com os próximos componentes!
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-4"
          >
            Continuar Desenvolvimento
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 