import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Home, Package, ShoppingBag, Users, BarChart3, Receipt, Settings, Menu, X, UserCheck, LogOut, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartProvider, useCart } from "@/components/providers/CartContext";
import { FavoritesProvider } from "@/components/providers/FavoritesContext";
import Navbar from "@/components/ui/Navbar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserAvatarDropdown from "@/components/auth/UserAvatarDropdown";

const publicPages = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Produtos",
    url: createPageUrl("Produtos"),
    icon: Package,
  },
  {
    title: "Favoritos",
    url: createPageUrl("Favoritos"),
    icon: Heart,
  },
  {
    title: "Sobre",
    url: createPageUrl("Sobre"),
    icon: Users,
  }
];

const adminPages = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Produtos",
    url: createPageUrl("AdminProdutos"),
    icon: Package,
  },
  {
    title: "Vendas",
    url: createPageUrl("Vendas"),
    icon: ShoppingBag,
  },
  {
    title: "Clientes",
    url: createPageUrl("Clientes"),
    icon: Users,
  },
  {
    title: "Despesas",
    url: createPageUrl("Despesas"),
    icon: Receipt,
  },
  {
    title: "Relatórios",
    url: createPageUrl("Relatorios"),
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: createPageUrl("Configuracoes"),
    icon: Settings,
  }
];

// New component for the Cart Icon
function CartIcon() {
  const { cartCount } = useCart();
  return (
    <Link to={createPageUrl('Carrinho')} className="relative p-2 hover:bg-purple-100 rounded-full">
      <ShoppingBag className="w-6 h-6 text-gray-600"/>
      {cartCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-1 bg-purple-600 text-white">
          {cartCount}
        </Badge>
      )}
    </Link>
  );
}

// Renamed Layout to AppLayout to be wrapped by CartProvider
function AppLayout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Primeiro verificar se tem usuário logado via sistema customizado
      const customUser = localStorage.getItem('brechoLuliUser');
      if (customUser) {
        const userData = JSON.parse(customUser);
        // Verificar se a sessão ainda é válida (24 horas)
        if (Date.now() - userData.loginTime < 24 * 60 * 60 * 1000) {
          setUser({
            id: userData.id, // Adicionar id do cliente para uso futuro
            email: userData.email,
            full_name: userData.nome,
            role: 'user' // Assume custom users are regular users
          });
          setLoading(false);
          return; // Exit if custom user is found and valid
        } else {
          // Sessão expirada
          localStorage.removeItem('brechoLuliUser');
        }
      }

      // Tentar autenticação via Google/Admin (if no valid custom user was found)
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      // Usuário não autenticado - isso é normal para páginas públicas
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Remover sessão customizada
      localStorage.removeItem('brechoLuliUser');
      
      // Se for usuário do Google/Admin, fazer logout também
      // Check if `user` object exists and has an `email` property (indicating a Google/Admin user)
      // AND if 'brechoLuliUser' is now absent (ensuring we don't logout a custom user via User.logout)
      if (user && user.email && !localStorage.getItem('brechoLuliUser')) {
        await User.logout();
      }
      
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Forçar logout local mesmo se der erro no User.logout()
      localStorage.removeItem('brechoLuliUser'); // Ensure custom user is also removed if an error occurs
      setUser(null);
      window.location.href = '/';
    }
  };

  const isAdminPage = location.pathname.startsWith('/Admin') || location.pathname.startsWith('/Dashboard') || location.pathname.startsWith('/Configuracoes') || location.pathname.startsWith('/Relatorios') || location.pathname.startsWith('/Despesas') || location.pathname.startsWith('/Clientes') || location.pathname.startsWith('/Vendas');
  const isPublicPage = !isAdminPage;

  // Se for página admin e usuário não é admin, redirecionar
  if (isAdminPage && user && user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  
  if (isAdminPage && !user && !loading) {
     window.location.href = '/';
     return null;
  }

  const navigationItems = isAdminPage ? adminPages : publicPages;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Layout para páginas administrativas
  if (isAdminPage) {
    return (
      <SidebarProvider>
        <style>
          {`
            :root {
              --sage-50: #f8faf8;
              --sage-100: #e8f2e8;
              --sage-200: #d1e7d1;
              --sage-500: #7c9a7c;
              --sage-600: #6b8a6b;
              --sage-700: #5a785a;
              --beige-50: #faf9f7;
              --beige-100: #f3f1ed;
              --beige-200: #e8e4de;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: linear-gradient(135deg, var(--sage-50) 0%, var(--beige-50) 100%);
            }
          `}
        </style>
        <div className="min-h-screen flex w-full" style={{ background: 'linear-gradient(135deg, #f8faf8 0%, #faf9f7 100%)' }}>
          <Sidebar className="border-r border-sage-100/50 bg-white/80 backdrop-blur-sm">
            <SidebarHeader className="border-b border-sage-100/50 p-6">
              <div className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c3cbe9394_mandala.jpg" 
                  alt="Logo do Brechó" 
                  className="w-10 h-10 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Brechó da Luli</h2>
                  <p className="text-xs text-sage-600 font-medium">Gestão Completa</p>
                </div>
              </div>
              {user && (
                <div className="mt-4 p-3 bg-sage-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-sage-600">{user.email}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="mt-2 w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              )}
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`transition-all duration-200 rounded-xl p-3 ${
                              isActive 
                                ? 'bg-sage-100 text-sage-700 font-semibold' 
                                : 'hover:bg-sage-50/50 text-gray-600 hover:text-sage-700'
                            }`}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}

                    {/* Botão Ir para Loja */}
                    <div className="!mt-6 pt-4 border-t border-sage-200/60">
                      <Link
                        to={createPageUrl("Home")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Ir para Loja</span>
                      </Link>
                    </div>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/90 backdrop-blur-sm border-b border-sage-100/50 px-6 py-4 md:hidden shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-sage-50 p-2 rounded-lg transition-colors duration-200" />
                  <h1 className="text-xl font-bold text-gray-900">Brechó da Luli</h1>
                </div>
                <Link to={createPageUrl('Home')} className="text-sage-600 hover:text-sage-700">
                  Ver Loja
                </Link>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Layout para páginas públicas da loja
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <style>
        {`
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}
      </style>
      
      {/* Navbar do Brechó da Luli */}
      <Navbar
        currentUser={user}
        onLogout={handleLogout}
      />

      <main>{children}</main>

      {/* Footer público */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c3cbe9394_mandala.jpg" 
                  alt="Brechó da Luli" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-bold text-xl">Brechó da Luli</span>
              </div>
              <p className="text-gray-400">Moda sustentável com estilo único. Cada peça conta uma história.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                {publicPages.map((item) => (
                  <li key={item.title}>
                    <Link to={item.url} className="text-gray-400 hover:text-white transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 carol@brechodaluli.com</p>
                <p>📱 (66) 99957-3004</p>
                <p>📍 Sinop, MT</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Brechó da Luli. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Default export now wraps AppLayout with CartProvider
export default function LayoutWrapper(props) {
  return (
    <FavoritesProvider>
      <CartProvider>
        <AppLayout {...props} />
      </CartProvider>
    </FavoritesProvider>
  );
}
