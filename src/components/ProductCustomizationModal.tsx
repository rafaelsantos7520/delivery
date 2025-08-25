
import { Product } from '@/types';
import { ProductVariation, ComplementType } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ComplementSelection {
  complementId: string;
  name: string;
  type: ComplementType;
  isSelected: boolean;
  extraQuantity: number;
  unitPrice: number;
}

interface ProductCustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductCustomizationModal({ product, isOpen, onOpenChange }: ProductCustomizationModalProps) {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [complementSelections, setComplementSelections] = useState<ComplementSelection[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (product) {
      const initialVariation = product.variations[0] || null;
      setSelectedVariation(initialVariation);
      setComplementSelections([]);
    } else {
      setSelectedVariation(null);
      setComplementSelections([]);
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariation) {
      const complementsTotal = complementSelections.reduce((acc, c) => {
        return acc + (c.extraQuantity * c.unitPrice);
      }, 0);
      setTotalPrice(selectedVariation.basePrice + complementsTotal);
    }
  }, [selectedVariation, complementSelections]);

  const toggleComplement = (complementId: string, name: string, type: ComplementType, unitPrice: number) => {
    setComplementSelections(prev => {
      const existing = prev.find(c => c.complementId === complementId);
      if (existing) {
        return prev.map(c =>
          c.complementId === complementId
            ? { ...c, isSelected: !c.isSelected }
            : c
        );
      } else {
        return [...prev, { complementId, name, type, isSelected: true, extraQuantity: 0, unitPrice }];
      }
    });
  };

  const updateExtraQuantity = (complementId: string, name: string, type: ComplementType, unitPrice: number, change: number) => {
    setComplementSelections(prev => {
      const existing = prev.find(c => c.complementId === complementId);
      if (existing) {
        const newExtraQuantity = Math.max(0, existing.extraQuantity + change);
        return prev.map(c =>
          c.complementId === complementId
            ? { ...c, extraQuantity: newExtraQuantity }
            : c
        );
      } else if (change > 0) {
        return [...prev, { complementId, name, type, isSelected: false, extraQuantity: 1, unitPrice }];
      }
      return prev;
    });
  };

  const getComplementSelection = (complementId: string) => {
    const complement = complementSelections.find(c => c.complementId === complementId);
    return complement || { complementId, name: '', type: 'acompanhamento', isSelected: false, extraQuantity: 0, unitPrice: 0 };
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariation) return;

    const cartItem = {
      product,
      selectedVariation,
      complementSelections,
      totalPrice,
    };

    addToCart(cartItem);
    onOpenChange(false);
  };

  if (!product || !isOpen) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-800">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Seleção de Tamanho */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Escolha o tamanho:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => {
                    setSelectedVariation(variation);
                    setComplementSelections([]);
                  }}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    selectedVariation?.id === variation.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-400'
                  }`}
                >
                  <div className="font-semibold">{variation.name}</div>
                  <div className="text-xl font-bold text-purple-600">R$ {variation.basePrice.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    {variation.includedComplements} acompanhamentos + {variation.includedFruits} fruta grátis
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Complementos */}
          {selectedVariation && Object.entries(complementsByType).map(([type, complements]) => {
            const typeNames = {
              'acompanhamento': 'Acompanhamentos',
              'fruta': 'Frutas',
              'cobertura': 'Coberturas'
            };
            const includedCount = type === 'fruta' ? selectedVariation.includedFruits : selectedVariation.includedComplements;
            const totalSelected = complementSelections.filter(c => c.type === type && c.isSelected).length;

            return (
              <div key={type} className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-700">
                  {typeNames[type as keyof typeof typeNames] || type}
                  {type !== 'cobertura' && 
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      ({totalSelected}/{includedCount} selecionados)
                    </span>
                  }
                </h3>
                {totalSelected >= includedCount && type !== 'cobertura' && (
                  <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                    Você já selecionou o máximo de {includedCount} complementos grátis para este tamanho.
                  </div>
                )}
                <div className="space-y-2">
                  {complements.map(complement => {
                    const selection = getComplementSelection(complement.id);
                    const isDisabled = !selection.isSelected && totalSelected >= includedCount && type !== 'cobertura';

                    return (
                      <div key={complement.id} className="p-3 bg-gray-50 rounded-lg">
                        {complement.included ? (
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selection.isSelected}
                              onChange={() => toggleComplement(complement.id, complement.name, complement.type, complement.extraPrice)}
                              disabled={isDisabled}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="font-medium">{complement.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{complement.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">R$ {complement.extraPrice.toFixed(2)}</span>
                              <button
                                onClick={() => updateExtraQuantity(complement.id, complement.name, complement.type, complement.extraPrice, -1)}
                                disabled={selection.extraQuantity === 0}
                                className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors text-xs"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center font-semibold text-sm">{selection.extraQuantity}</span>
                              <button
                                onClick={() => updateExtraQuantity(complement.id, complement.name, complement.type, complement.extraPrice, 1)}
                                className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors text-xs"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                        {selection.extraQuantity > 0 && (
                          <div className="text-sm text-blue-600 text-right mt-1">
                            Subtotal: R$ {(selection.extraQuantity * complement.extraPrice).toFixed(2)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Rodapé */}
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">Total do pedido</p>
                <p className="text-3xl font-bold text-purple-600">R$ {totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariation}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 min-w-[200px] justify-center"
              >
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
