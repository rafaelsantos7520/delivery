
import { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
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

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'acai':
        return '🍇';
      case 'batida':
        return '🥤';
      default:
        return '🍽️';
    }
  };

  const minPrice = Math.min(...product.variations.map(v => v.basePrice));
  const maxPrice = Math.max(...product.variations.map(v => v.basePrice));

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-gray-50 h-full flex flex-col">
      <div className="relative flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getCategoryColor(product.category)} font-medium`}>
                  {getCategoryEmoji(product.category)} {product.category === 'acai' ? 'Açaí' : 'Batida'}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {product.name}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                {product.description}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-4 flex-1 flex flex-col">
           <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
             <Image
               src={product.imageUrl || '/acai.jpg'}
               alt={product.name}
               fill
               className="object-cover group-hover:scale-110 transition-transform duration-500"
             />
             <div className="absolute top-3 right-3 z-20">
               <Badge className="bg-yellow-500 text-yellow-900 font-bold shadow-lg">
                 ⭐ Popular
               </Badge>
             </div>
           </div>
           
           <div className="space-y-2 flex-1">
             <div className="flex items-center justify-between">
               <span className="text-sm font-medium text-gray-600">Tamanhos disponíveis:</span>
               <span className="text-sm text-purple-600 font-medium">{product.variations.length} opções</span>
             </div>
             
             <div className="flex flex-wrap gap-1">
               {product.variations.map((variation, index) => (
                 <Badge key={index} variant="outline" className="text-xs">
                   {variation.name}
                 </Badge>
               ))}
             </div>
           </div>
         </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-2">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">A partir de</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600">
                    R$ {minPrice.toFixed(2)}
                  </span>
                  {minPrice !== maxPrice && (
                    <span className="text-sm text-gray-500">
                      até R$ {maxPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Complementos</p>
                <p className="text-sm font-medium text-green-600">Inclusos!</p>
              </div>
            </div>
            
            <Button 
              onClick={() => onOpenModal(product)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Montar o seu açaí
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
