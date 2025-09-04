
'use client';

import { Product } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ProductClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductClient({ initialProducts, categories }: ProductClientProps) {
  const router = useRouter();
  const [products] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}/customize`);
  };

  const getCategoryEmoji = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('açaí') || name.includes('acai')) return '🍇';
    if (name.includes('batida')) return '🥤';
    if (name.includes('sorvete')) return '🍦';
    if (name.includes('bebida')) return '🥤';
    if (name.includes('lanche')) return '🥪';
    return '🍽️';
  };

  return (
    <div className="space-y-8">
      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="mb-4">
          <div className="relative w-full max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl w-full"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Categoria:</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full text-xs sm:text-sm px-3 py-1.5"
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full text-xs sm:text-sm px-3 py-1.5"
              >
                {getCategoryEmoji(category.name)} {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </Badge>
          
          <div className="text-xs sm:text-sm text-gray-500">
            💜 Feito com amor para você!
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} onProductClick={handleProductClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
