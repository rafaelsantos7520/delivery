
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShoppingCart, Coffee, Grape } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'acai':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'batida':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'acai':
        return <Grape className="h-4 w-4" />;
      case 'batida':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Coffee className="h-4 w-4" />;
    }
  };

  const minPrice = Math.min(...product.variations.map(v => v.basePrice));
  const maxPrice = Math.max(...product.variations.map(v => v.basePrice));

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-gray-50 min-h-[350px] sm:min-h-[400px] h-auto flex flex-col">
      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Badge className={`${getCategoryColor(product.category)} font-medium flex items-center gap-1 text-xs sm:text-sm`}>
                {getCategoryIcon(product.category)}
                {product.category === 'acai' ? 'Açaí' : 'Batida'}
              </Badge>
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
              {product.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 sm:px-6 pb-3 sm:pb-4 flex-1">
        <div className="relative aspect-[4/3] mb-3 sm:mb-4 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <Image
            src={product.imageUrl || '/acai.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 mt-auto">
        <div className="w-full space-y-3 sm:space-y-4">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">A partir de</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-purple-600">
                R$ {minPrice.toFixed(2)}
              </span>
              {minPrice !== maxPrice && (
                <span className="text-xs sm:text-sm text-gray-500">
                  até R$ {maxPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => onProductClick(product)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
            Personalizar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
