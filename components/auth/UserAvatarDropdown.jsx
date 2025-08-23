import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Heart, 
  ShoppingBag, 
  LogOut, 
  Crown,
  ChevronDown,
  Bell,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUser } from '@/entities/User';

const UserAvatarDropdown = ({ user = mockUser, onLogout, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menu items
  const menuItems = [
    {
      icon: User,
      label: 'Meu Perfil',
      href: '/perfil',
      description: 'Gerenciar informações pessoais'
    },
    {
      icon: ShoppingBag,
      label: 'Meus Pedidos',
      href: '/pedidos',
      description: 'Acompanhar compras',
      badge: '2'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      href: '/favoritos',
      description: 'Produtos salvos'
    },
    {
      icon: Bell,
      label: 'Notificações',
      href: '/notificacoes',
      description: 'Alertas e avisos',
      badge: '3'
    },
    {
      icon: Settings,
      label: 'Configurações',
      href: '/configuracoes',
      description: 'Preferências da conta'
    }
  ];

  // Menu items para admin
  const adminItems = [
    {
      icon: Package,
      label: 'Admin Dashboard',
      href: '/admin',
      description: 'Painel administrativo',
      adminOnly: true
    }
  ];

  const allMenuItems = user?.isAdmin() ? [...adminItems, ...menuItems] : menuItems;

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Avatar Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Avatar Image ou Iniciais */}
        <div className="relative">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.nome}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-sage-500 flex items-center justify-center text-white text-sm font-medium">
              {user?.getInitials() || 'U'}
            </div>
          )}
          
          {/* Indicador Online */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>

        {/* Nome do usuário (desktop) */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 truncate max-w-32">
            {user?.nome || 'Usuário'}
          </span>
          {user?.isAdmin() && (
            <Badge variant="purple" className="text-xs px-2 py-0">
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* Header do Dropdown */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-sage-500 flex items-center justify-center text-white font-medium">
                      {user?.getInitials() || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                  {user?.isAdmin() && (
                    <Badge variant="purple" className="text-xs mt-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Administrador
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {allMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`p-2 rounded-lg ${
                      item.adminOnly 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {item.description}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-100 pt-2">
              <motion.button
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: allMenuItems.length * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group w-full"
                onClick={() => {
                  setIsOpen(false);
                  onLogout?.();
                }}
              >
                <div className="p-2 rounded-lg bg-red-100 text-red-600 group-hover:bg-red-200">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-medium">Sair da Conta</span>
                  <p className="text-xs text-red-500">
                    Desconectar do sistema
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatarDropdown; 