
import { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl || '/acai.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">A partir de</p>
          <p className="text-lg font-semibold">R$ {product.variations[0]?.basePrice.toFixed(2)}</p>
        </div>
        <Button onClick={() => onOpenModal(product)}>Montar o seu</Button>
      </CardFooter>
    </Card>
  );
}
