'use client'

import { LojaLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui'
import { Heart, Leaf, Users, Award, Clock, MapPin } from 'lucide-react'

export default function SobrePage() {
  return (
    <LojaLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre a Retrô Carólis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Moda sustentável e acessível desde 2020. Acreditamos que estilo e consciência ambiental caminham juntos.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-lg opacity-90">
              Promover uma moda mais sustentável e acessível, oferecendo peças únicas de qualidade
              enquanto reduzimos o impacto ambiental da indústria da moda. Cada peça em nossa loja
              conta uma história e ganha uma nova vida.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sustentabilidade
                </h3>
                <p className="text-gray-600">
                  Reduzimos o desperdício têxtil dando nova vida a roupas de qualidade,
                  contribuindo para um planeta mais saudável.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Qualidade
                </h3>
                <p className="text-gray-600">
                  Cada peça é cuidadosamente selecionada e inspecionada para garantir
                  que você receba produtos em excelente estado.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered" className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Comunidade
                </h3>
                <p className="text-gray-600">
                  Valorizamos fornecedores locais e criamos oportunidades para pessoas
                  venderem suas peças em consignação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nossa Jornada em Números
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5.000+</div>
              <div className="text-gray-600">Peças Vendidas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2.000+</div>
              <div className="text-gray-600">Clientes Felizes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Fornecedores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">4+</div>
              <div className="text-gray-600">Anos no Mercado</div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Consignação
              </h3>
              <p className="text-gray-600">
                Recebemos peças de qualidade de fornecedores locais que ganham crédito
                quando suas roupas são vendidas.
              </p>
            </div>

            <div className="relative">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Curadoria
              </h3>
              <p className="text-gray-600">
                Nossa equipe seleciona e prepara cada peça com cuidado, garantindo
                qualidade e estilo para nossos clientes.
              </p>
            </div>

            <div className="relative">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Você Compra
              </h3>
              <p className="text-gray-600">
                Encontre peças únicas com preços acessíveis, sabendo que está fazendo
                uma escolha sustentável.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <Card variant="bordered">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Visite Nossa Loja
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Endereço</h4>
                    <p className="text-gray-600">
                      Rua das Flores, 123<br />
                      Centro - São Paulo, SP<br />
                      CEP: 01234-567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Horário</h4>
                    <p className="text-gray-600">
                      Segunda a Sexta: 9h - 18h<br />
                      Sábado: 9h - 14h<br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contato</h4>
                  <p className="text-gray-600">
                    📧 contato@retrocarolis.com.br<br />
                    📱 (11) 98765-4321<br />
                    💬 WhatsApp: (11) 98765-4321
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Redes Sociais</h4>
                  <div className="flex gap-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700">Instagram</a>
                    <a href="#" className="text-blue-600 hover:text-blue-700">Facebook</a>
                    <a href="#" className="text-blue-600 hover:text-blue-700">Pinterest</a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Fazer Parte do Movimento?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Descubra peças únicas e contribua para um futuro mais sustentável
          </p>
          <a href="/loja" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Explorar Produtos
          </a>
        </div>
      </div>
    </LojaLayout>
  )
}
