import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Recycle, Sparkles } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c3cbe9394_mandala.jpg"
            alt="Logo Brechó da Luli"
            className="w-24 h-24 mx-auto rounded-full shadow-lg mb-4"
          />
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            Nossa História
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Mais que um brechó, um movimento de moda consciente e cheia de estilo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              O <strong>Brechó da Luli</strong> nasceu de um sonho: unir o amor pela moda com a paixão pela sustentabilidade. Acreditamos que cada peça de roupa carrega uma história e merece uma segunda, terceira, ou até quarta chance de brilhar.
            </p>
            <p>
              Nossa curadoria é feita com muito carinho e atenção aos detalhes. Selecionamos itens únicos, de qualidade e que conversam com as tendências atuais, sem nunca perder o charme atemporal. Queremos que você encontre aqui não apenas uma roupa, mas uma forma de expressar sua identidade de maneira autêntica e consciente.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 text-center">
              <div className="p-4 border-l-4 border-purple-400">
                <Heart className="mx-auto h-10 w-10 text-purple-500 mb-3" />
                <h3 className="font-bold text-lg">Curadoria com Amor</h3>
                <p className="text-sm">Peças selecionadas a dedo para garantir qualidade e estilo.</p>
              </div>
              <div className="p-4 border-l-4 border-green-400">
                <Recycle className="mx-auto h-10 w-10 text-green-500 mb-3" />
                <h3 className="font-bold text-lg">Moda Sustentável</h3>
                <p className="text-sm">Contribuindo para um ciclo de consumo mais consciente.</p>
              </div>
              <div className="p-4 border-l-4 border-blue-400">
                <Sparkles className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                <h3 className="font-bold text-lg">Achados Únicos</h3>
                <p className="text-sm">Encontre tesouros que ninguém mais terá.</p>
              </div>
            </div>
            
            <p>
              Ao escolher o Brechó da Luli, você não está apenas comprando uma peça de roupa. Você está se juntando a uma comunidade que valoriza a história, a individualidade e o futuro do nosso planeta.
            </p>
            <p>Obrigada por fazer parte da nossa jornada!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}