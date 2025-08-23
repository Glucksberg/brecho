import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Youtube,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Institucional",
      links: [
        { label: "Sobre nós", href: "/sobre" },
        { label: "Nossa história", href: "/historia" },
        { label: "Trabalhe conosco", href: "/carreiras" },
        { label: "Imprensa", href: "/imprensa" },
        { label: "Sustentabilidade", href: "/sustentabilidade" }
      ]
    },
    {
      title: "Atendimento",
      links: [
        { label: "Central de ajuda", href: "/ajuda" },
        { label: "Como comprar", href: "/como-comprar" },
        { label: "Política de privacidade", href: "/privacidade" },
        { label: "Termos de uso", href: "/termos" },
        { label: "Trocas e devoluções", href: "/trocas" }
      ]
    },
    {
      title: "Categorias",
      links: [
        { label: "Roupas femininas", href: "/categoria/roupas-femininas" },
        { label: "Acessórios", href: "/categoria/acessorios" },
        { label: "Calçados", href: "/categoria/calcados" },
        { label: "Bolsas", href: "/categoria/bolsas" },
        { label: "Joias", href: "/categoria/joias" }
      ]
    }
  ];

  const benefits = [
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Para compras acima de R$ 150"
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Seus dados protegidos"
    },
    {
      icon: RefreshCw,
      title: "Troca Fácil",
      description: "7 dias para trocar"
    },
    {
      icon: CreditCard,
      title: "Parcele sem Juros",
      description: "Em até 12x no cartão"
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/brecho", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/brecho", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/brecho", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/brecho", label: "YouTube" }
  ];

  const handleNavigation = (href) => {
    window.location.href = href;
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      // Simular cadastro na newsletter
      alert(`E-mail ${email} cadastrado com sucesso!`);
      e.target.reset();
    }
  };

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      {/* Benefícios */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-300">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo e Descrição */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <span className="ml-3 text-2xl font-bold">Brêcho</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Moda sustentável e acessível para todos. Encontre peças únicas 
                  e dê uma nova vida às suas roupas favoritas. Junte-se ao movimento 
                  da moda consciente.
                </p>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-white mb-3">Newsletter</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Receba ofertas exclusivas e novidades
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Seu e-mail"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    required
                  />
                  <Button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* Links das Seções */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (sectionIndex + 1) * 0.1 }}
              >
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleNavigation(link.href)}
                        className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Contato e Redes Sociais */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informações de Contato */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold text-white mb-4">Fale Conosco</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">(11) 99999-9999</p>
                    <p className="text-gray-300 text-sm">Segunda a sexta, 9h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">contato@brecho.com</p>
                    <p className="text-gray-300 text-sm">Respondemos em até 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">São Paulo, SP</p>
                    <p className="text-gray-300 text-sm">Brasil</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Redes Sociais */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <h3 className="font-semibold text-white mb-4">Siga-nos</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
              
              <p className="text-gray-300 text-sm mt-4">
                Siga nossas redes sociais para dicas de moda sustentável e novidades
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-300 text-sm">
              <span>© {currentYear} Brêcho. Todos os direitos reservados.</span>
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>para o planeta.</span>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => handleNavigation('/privacidade')}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                Privacidade
              </button>
              <button
                onClick={() => handleNavigation('/termos')}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                Termos
              </button>
              <button
                onClick={() => handleNavigation('/cookies')}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Variações do Footer
export const SimpleFooter = () => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <span className="ml-2 text-xl font-bold">Brêcho</span>
      </div>
      <p className="text-gray-300 text-sm">
        © {new Date().getFullYear()} Brêcho. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export const AdminFooter = () => (
  <footer className="bg-gray-800 text-white py-4 border-t border-gray-700">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-gray-300 text-sm">
        © {new Date().getFullYear()} Brêcho Admin. Sistema de gerenciamento.
      </p>
    </div>
  </footer>
);

export default Footer; 