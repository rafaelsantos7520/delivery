'use client';

import { ProductList } from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Phone, Star, Zap, ThumbsUp, Heart, ShoppingCart } from "lucide-react";
import { comerceData } from "@/utils/comerceData";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white pt-20 pb-28">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Prime Açaiteria
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-purple-100">
                Hoje é dia de Açaí
              </p>
              <p className="text-lg mb-8 text-purple-200 max-w-2xl mx-auto">
                O melhor açaí da região com ingredientes frescos e sabores únicos. 
                Venha experimentar nossa variedade de açaís, batidas e complementos deliciosos!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-semibold px-8 py-3 shadow-lg transform hover:scale-105 transition-transform"
                  onClick={() => document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Cardápio
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 shadow-lg transform hover:scale-105 transition-transform"
                  onClick={() => window.open(`https://wa.me/${comerceData.whatsapp}`, '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Fazer Pedido
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cardápio */}
        <section id="cardapio" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">Nosso Cardápio</h2>
              <p className="text-xl text-gray-600">
                Escolha seu açaí favorito e personalize do seu jeito!
              </p>
            </div>
            <ProductList />
          </div>
        </section>

        {/* Como Pedir */}
        <section id="como-pedir" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Como Pedir</h2>
                    <p className="text-xl text-gray-600">É fácil, rápido e delicioso!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <Zap className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">1. Monte seu Açaí</h3>
                        <p className="text-gray-600">Escolha o tamanho, os acompanhamentos, frutas e coberturas que você mais ama.</p>
                    </div>
                    <div className="p-6">
                        <ShoppingCart className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">2. Adicione ao Carrinho</h3>
                        <p className="text-gray-600">Adicione quantos itens quiser ao seu carrinho e prossiga para o checkout.</p>
                    </div>
                    <div className="p-6">
                        <ThumbsUp className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">3. Finalize e Receba</h3>
                        <p className="text-gray-600">Preencha seus dados, confirme o pedido e aguarde essa delícia chegar no seu endereço!</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">O que nossos clientes dizem</h2>
                    <p className="text-xl text-gray-600">A satisfação de vocês é o nosso melhor ingrediente!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <Heart className="h-8 w-8 text-red-500 mr-4" />
                            <div>
                                <h4 className="font-bold text-lg">Mariana Silva</h4>
                                <div className="flex text-yellow-400"> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">“O melhor açaí que já comi! A entrega foi super rápida e o açaí veio perfeito, super cremoso e com os melhores acompanhamentos. Virei cliente fiel!”</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <Heart className="h-8 w-8 text-red-500 mr-4" />
                            <div>
                                <h4 className="font-bold text-lg">João Pereira</h4>
                                <div className="flex text-yellow-400"> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">“Atendimento nota 10 e produtos de qualidade. A variedade de complementos é incrível, dá pra montar o açaí do jeito que eu gosto. Recomendo demais!”</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <Heart className="h-8 w-8 text-red-500 mr-4" />
                            <div>
                                <h4 className="font-bold text-lg">Carla Souza</h4>
                                <div className="flex text-yellow-400"> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> <Star size={16}/> </div>
                            </div>
                        </div>
                        <p className="text-gray-600 italic">“Simplesmente maravilhoso! O açaí é delicioso e o sistema de pedidos pelo site é muito prático. Facilita muito a vida na hora da fome. Parabéns!”</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-purple-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Prime Açaiteria</h3>
            <p className="text-purple-200 mb-6">Hoje é dia de Açaí</p>
            
            <div className="flex justify-center space-x-6 mb-6">
              <a 
                href={`https://wa.me/${comerceData.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>(98) 98426-7957</span>
              </a>
              <a 
                href={comerceData.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors"
              >
                <span className="text-xl">📱</span>
                <span>@prime_acaiteria1</span>
              </a>
            </div>
            
            <p className="text-purple-300 text-sm">
              © 2024 Prime Açaiteria. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
