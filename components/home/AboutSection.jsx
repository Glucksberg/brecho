import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Recycle } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Sustentável',
      description: 'Contribua para um mundo mais sustentável reutilizando roupas'
    },
    {
      icon: Heart,
      title: 'Com Amor',
      description: 'Cada peça é cuidadosamente selecionada e verificada'
    },
    {
      icon: Recycle,
      title: 'Circular',
      description: 'Economia circular que beneficia todos'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Moda Sustentável para um Futuro Melhor
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              No Brêcho CloudFarm, acreditamos que a moda pode ser bonita, acessível e sustentável. 
              Cada peça em nossa loja tem uma história e está pronta para começar uma nova jornada com você.
            </p>
            
            <div className="space-y-6 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button size="lg" variant="purple">
              Saiba Mais
            </Button>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-sage-100 rounded-2xl p-8 h-96 flex items-center justify-center">
              <p className="text-gray-600 text-center">
                Imagem sobre sustentabilidade
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 