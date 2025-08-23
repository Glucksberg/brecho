import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Heart, 
  User, 
  Search,
  Store,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatarDropdown } from '@/components/auth/UserAvatarDropdown';
import { useCart } from '@/components/providers/CartContext';
import { useFavorites } from '@/components/providers/FavoritesContext';

const Navbar = ({ 
  currentUser = null,
  onLogin,
  onRegister,
  onLogout,
  className = ""
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items: cartItems } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();

  // Detectar scroll para mudar estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu items simplificado seguindo o design do Brechó da Luli
  const navItems = [
    { label: 'Início', href: '/', id: 'home' },
    { label: 'Produtos', href: '/Produtos', id: 'produtos' },
    { label: 'Favoritos', href: '/Favoritos', id: 'favoritos' },
    { label: 'Sobre', href: '/Sobre', id: 'sobre' }
  ];

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/Home';
    }
    return location.pathname === href;
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brechó da Luli */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Brechó da Luli
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 group ${
                  isActiveRoute(item.href)
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-200 ${
                  isActiveRoute(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Favoritos */}
            <Link to="/Favoritos">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-purple-50"
              >
                <Heart className={`w-5 h-5 ${isActiveRoute('/Favoritos') ? 'text-purple-600 fill-purple-600' : ''}`} />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Carrinho */}
            <Link to="/Carrinho">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-purple-50"
              >
                <ShoppingCart className={`w-5 h-5 ${isActiveRoute('/Carrinho') ? 'text-purple-600' : ''}`} />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-purple-600 text-white">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <UserAvatarDropdown
                user={currentUser}
                onLogout={onLogout}
              />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/Entrar">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:bg-purple-50"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/Cadastro">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={handleCloseMenu}
                  className={`block w-full text-left px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4">
                {/* User Actions - Mobile */}
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900 font-medium">{currentUser.nome}</span>
                    </div>
                    
                    <Link
                      to="/MinhaConta"
                      onClick={handleCloseMenu}
                      className="flex items-center w-full text-left text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-lg"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Minha Conta
                    </Link>
                    
                    <button
                      onClick={() => {
                        onLogout?.();
                        handleCloseMenu();
                      }}
                      className="flex items-center w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
                    >
                      <X className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/Entrar" onClick={handleCloseMenu}>
                      <Button
                        variant="outline"
                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/Cadastro" onClick={handleCloseMenu}>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm">
        <span>✨ Frete grátis para compras acima de R$ 150,00 • Moda sustentável que reconta histórias</span>
      </div>
    </motion.nav>
  );
};

// Variações específicas da Navbar
export const AdminNavbar = ({ currentUser, onLogout, ...props }) => {
  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', id: 'dashboard' },
    { label: 'Produtos', href: '/admin/produtos', id: 'produtos' },
    { label: 'Vendas', href: '/admin/vendas', id: 'vendas' },
    { label: 'Clientes', href: '/admin/clientes', id: 'clientes' },
    { label: 'Relatórios', href: '/admin/relatorios', id: 'relatorios' }
  ];

  return (
    <Navbar
      {...props}
      currentUser={currentUser}
      onLogout={onLogout}
      navItems={adminNavItems}
      className="bg-gray-900 text-white"
    />
  );
};

export const SimpleNavbar = ({ ...props }) => (
  <Navbar
    {...props}
    className="shadow-none border-b"
  />
);

export default Navbar; 