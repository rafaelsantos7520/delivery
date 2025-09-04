
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

export function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cache configuration - Estratégia de cache para otimizar performance
  // Os produtos são armazenados no localStorage por 5 minutos
  // Isso reduz requisições desnecessárias à API quando o componente é re-renderizado
  const CACHE_KEY = 'acai_products_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milliseconds

  useEffect(() => {
    // Função para verificar se o cache é válido
    const isCacheValid = (timestamp: number) => {
      return Date.now() - timestamp < CACHE_DURATION;
    };

    const fetchData = async () => {
      try {
        // Verificar se existe cache válido
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          
          // Se o cache ainda é válido
          if (isCacheValid(timestamp)) {
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
            return;
          }
        }

        // Buscar produtos e categorias em paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        // Salvar produtos no cache com timestamp
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: productsData,
          timestamp: Date.now()
        }));
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        // Em caso de erro, tentar usar cache mesmo que expirado
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          setProducts(data);
          setFilteredProducts(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [CACHE_KEY, CACHE_DURATION]);

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

  // Função para obter emoji da categoria
  const getCategoryEmoji = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('açaí') || name.includes('acai')) return '🍇';
    if (name.includes('batida')) return '🥤';
    if (name.includes('sorvete')) return '🍦';
    if (name.includes('bebida')) return '🥤';
    if (name.includes('lanche')) return '🥪';
    return '🍽️';
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="text-lg font-medium text-gray-600">Carregando nossos deliciosos produtos...</span>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        {/* Campo de Busca */}
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
        
        {/* Filtros de Categoria */}
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
        
        {/* Contador e Mensagem */}
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
