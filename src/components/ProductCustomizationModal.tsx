import { Product } from '@/types';
import { ProductVariation } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

interface ComplementSelection {
  complementId: string;
  name: string;
  type: string;
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

  const toggleComplement = (complementId: string, name: string, type: string, unitPrice: number) => {
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

  const updateExtraQuantity = (complementId: string, name: string, type: string, unitPrice: number, change: number) => {
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
    return complement || { complementId, name: '', type: '', isSelected: false, extraQuantity: 0, unitPrice: 0 };
  };

  const generateWhatsAppMessage = () => {
    if (!product || !selectedVariation) return;

    let message = `Olá, gostaria de fazer um pedido:

`;
    message += `*Produto:* ${product.name}
`;
    message += `*Tamanho:* ${selectedVariation.name}
`;

    const selectedComplements = complementSelections.filter(c => c.isSelected || c.extraQuantity > 0);
    if (selectedComplements.length > 0) {
      const included = selectedComplements.filter(c => c.isSelected);
      if (included.length > 0) {
        message += `*Complementos Inclusos:*
`;
        included.forEach(c => {
          message += `  - ${c.name}
`;
        });
      }
      
      const extras = selectedComplements.filter(c => c.extraQuantity > 0);
      if (extras.length > 0) {
        message += `*Extras:*
`;
        extras.forEach(c => {
          message += `  - ${c.name} (${c.extraQuantity}x) - R$ ${(c.extraQuantity * c.unitPrice).toFixed(2)}
`;
        });
      }
    }

    message += `
*Total:* R$ ${totalPrice.toFixed(2)}`;

    const phone = '5511999999999'; // Substituir pelo número real
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (!product || !isOpen) {
    return null;
  }

  const includedComplements = product.complements.filter(pc => pc.complement.included);
  const extraComplements = product.complements; 

  const includedComplementsByType = includedComplements.reduce((acc, pc) => {
    const type = pc.complement.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(pc.complement);
    return acc;
  }, {} as Record<string, typeof product.complements[0]['complement'][]>);

  const extraComplementsByType = extraComplements.reduce((acc, pc) => {
    const type = pc.complement.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(pc.complement);
    return acc;
  }, {} as Record<string, typeof product.complements[0]['complement'][]>);

  const typeNames = {
    'acompanhamento': 'Acompanhamentos',
    'fruta': 'Frutas',
    'cobertura': 'Coberturas'
  };

  const selectedIncludedFruits = complementSelections.filter(c => c.type === 'fruta' && c.isSelected).length;
  const selectedIncludedAcompanhamentos = complementSelections.filter(c => c.type === 'acompanhamento' && c.isSelected).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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

          {selectedVariation && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-700">
                Acompanhamentos Inclusos
              </h3>
              {Object.entries(includedComplementsByType).map(([type, complements]) => {
                const isFruit = type === 'fruta';
                const limit = isFruit ? selectedVariation.includedFruits : selectedVariation.includedComplements;
                const selectedCount = isFruit ? selectedIncludedFruits : selectedIncludedAcompanhamentos;

                if (limit === 0) return null;

                return (
                  <div key={type} className="mb-4">
                    <h4 className="text-md font-semibold mb-2 text-blue-700">
                      {typeNames[type as keyof typeof typeNames] || type}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({selectedCount}/{limit} selecionados)
                      </span>
                    </h4>
                    {selectedCount >= limit && (
                      <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                        Você já selecionou o máximo de {limit} {typeNames[type as keyof typeof typeNames]?.toLowerCase() || type} grátis para este tamanho.
                      </div>
                    )}
                    <div className="space-y-2">
                      {complements.map(complement => {
                        const selection = getComplementSelection(complement.id);
                        const isDisabled = !selection.isSelected && selectedCount >= limit;

                        return (
                          <div key={complement.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selection.isSelected}
                              onChange={() => toggleComplement(complement.id, complement.name, type, complement.extraPrice)}
                              disabled={isDisabled}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="font-medium">{complement.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedVariation && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-700">
                Turbine seu Açaí (Extras)
              </h3>
              {Object.entries(extraComplementsByType).map(([type, complements]) => (
                <div key={type} className="mb-4">
                  <h4 className="text-md font-semibold mb-2 text-blue-700">
                    {typeNames[type as keyof typeof typeNames] || type}
                  </h4>
                  <div className="space-y-2">
                    {complements.map(complement => {
                      const selection = getComplementSelection(complement.id);
                      return (
                        <div key={complement.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{complement.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">R$ {complement.extraPrice.toFixed(2)}</span>
                              <button
                                onClick={() => updateExtraQuantity(complement.id, complement.name, type, complement.extraPrice, -1)}
                                disabled={selection.extraQuantity === 0}
                                className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors text-xs"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center font-semibold text-sm">{selection.extraQuantity}</span>
                              <button
                                onClick={() => updateExtraQuantity(complement.id, complement.name, type, complement.extraPrice, 1)}
                                className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors text-xs"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
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
              ))}
            </div>
          )}

          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">Total do pedido</p>
                <p className="text-3xl font-bold text-purple-600">R$ {totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={generateWhatsAppMessage}
                disabled={!selectedVariation}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 min-w-[200px] justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                Pedir via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}