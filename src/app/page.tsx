'use client';

import { ProductList } from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-20">
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
                className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-semibold px-8 py-3"
                onClick={() => document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Cardápio
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3"
                onClick={() => window.open('https://wa.me/5598984267957', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Fazer Pedido
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* Cardápio */}
      <section id="cardapio" className="py-16 bg-gray-50">
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

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Prime Açaiteria</h3>
          <p className="text-purple-200 mb-6">Hoje é dia de Açaí</p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <a 
              href="https://wa.me/5598984267957" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span>(98) 98426-7957</span>
            </a>
            <a 
              href="https://instagram.com/prime_acaiteria1" 
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
  );
}