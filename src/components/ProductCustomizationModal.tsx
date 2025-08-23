
import { Product, ProductVariation, SelectedComplement } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ProductCustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductCustomizationModal({ product, isOpen, onOpenChange }: ProductCustomizationModalProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedComplements, setSelectedComplements] = useState<SelectedComplement[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      const initialVariation = product.variations[0] || null;
      setSelectedVariation(initialVariation);
      setSelectedComplements([]);
    } else {
      setSelectedVariation(null);
      setSelectedComplements([]);
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariation) {
      const newTotalPrice = selectedVariation.basePrice + selectedComplements.reduce((acc, c) => acc + c.price, 0);
      setTotalPrice(newTotalPrice);
    }
  }, [selectedVariation, selectedComplements]);

  const handleComplementChange = (checked: boolean, complement: SelectedComplement) => {
    setSelectedComplements(prev => {
      if (checked) {
        return [...prev, complement];
      } else {
        return prev.filter(c => c.complementId !== complement.complementId);
      }
    });
  };

  const generateWhatsAppMessage = () => {
    if (!product || !selectedVariation) return;

    let message = `Olá, gostaria de fazer um pedido:\n\n`;
    message += `*Produto:* ${product.name}\n`;
    message += `*Tamanho:* ${selectedVariation.name}\n`;

    if (selectedComplements.length > 0) {
      message += `*Complementos:*\n`;
      selectedComplements.forEach(c => {
        message += `  - ${c.name}${c.price > 0 ? ` (R$ ${c.price.toFixed(2)})` : ''}\n`;
      });
    }

    message += `\n*Total:* R$ ${totalPrice.toFixed(2)}`;

    const phone = '5511999999999'; // Substitua pelo número de telefone da loja
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (!product) {
    return null;
  }

  const complementsByType = product.complements.reduce((acc, pc) => {
    const type = pc.complement.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(pc.complement);
    return acc;
  }, {} as Record<string, typeof product.complements[0]['complement'][]>);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tamanho</h3>
            <RadioGroup
              value={selectedVariation?.id}
              onValueChange={(id) => {
                const variation = product.variations.find((v) => v.id === id);
                if (variation) {
                  setSelectedVariation(variation);
                  // Reset complements when size changes
                  setSelectedComplements([]);
                }
              }}
            >
              {product.variations.map((variation) => (
                <div key={variation.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={variation.id} id={variation.id} />
                  <Label htmlFor={variation.id} className="flex justify-between w-full cursor-pointer">
                    <span>{variation.name}</span>
                    <span>R$ {variation.basePrice.toFixed(2)}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-6">
            {Object.entries(complementsByType).map(([type, complements]) => (
              <div key={type}>
                <h3 className="text-lg font-semibold mb-4 capitalize">{type}</h3>
                <div className="space-y-2">
                  {complements.map(complement => {
                    const isChecked = selectedComplements.some(c => c.complementId === complement.id);
                    const includedCount = selectedVariation ? (type === 'fruta' ? selectedVariation.includedFruits : selectedVariation.includedComplements) : 0;
                    const selectedOfType = selectedComplements.filter(c => c.type === type).length;
                    const isPaid = !complement.included || selectedOfType >= includedCount;
                    const price = isPaid ? complement.extraPrice : 0;
                    const isDisabled = !isChecked && selectedOfType >= includedCount && complement.included;

                    return (
                      <div key={complement.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={complement.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            handleComplementChange(!!checked, { complementId: complement.id, name: complement.name, price, type });
                          }}
                          disabled={isDisabled}
                        />
                        <Label htmlFor={complement.id} className={`flex justify-between w-full ${isDisabled ? 'cursor-not-allowed text-muted-foreground' : 'cursor-pointer'}`}>
                          <span>{complement.name}</span>
                          {price > 0 && <span>+ R$ {price.toFixed(2)}</span>}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
            <div className="flex justify-between items-center w-full">
                <p className="text-xl font-semibold">Total: R$ {totalPrice.toFixed(2)}</p>
                <Button onClick={generateWhatsAppMessage} size="lg">Pedir via WhatsApp</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
