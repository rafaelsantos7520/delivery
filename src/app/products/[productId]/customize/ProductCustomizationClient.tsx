'use client';

import { ProductVariation, Complement, ComplementType } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, AlertTriangle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

// Tipos locais para a página
interface ComplementSelection {
  complementId: string;
  name: string;
  type: ComplementType;
  isSelected: boolean;
  extraQuantity: number;
  unitPrice: number;
  selectionOrder: number;
}




export default function ProductCustomizationClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [complementSelections, setComplementSelections] = useState<ComplementSelection[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectionCounter, setSelectionCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    const initialVariation = product.variations[0] || null;
    setSelectedVariation(initialVariation);
    setComplementSelections([]);
  }, [product]);

  useEffect(() => {
    if (selectedVariation) {
      const complementsTotal = complementSelections.reduce((acc, c) => {
        // Para complementos inclusos, apenas cobrar se exceder o limite gratuito
        if (c.isSelected || c.extraQuantity > 0) {
          const includedCount = c.type === 'FRUTA' ? selectedVariation.includedFruits : 
                                c.type === 'COBERTURA' ? selectedVariation.includedCoverages : 
                                c.type === 'ACOMPANHAMENTO' ? selectedVariation.includedComplements : 0;
          const selectedOfSameType = complementSelections.filter(sel => 
            sel.type === c.type && sel.isSelected
          );
          
          // Ordenar por ordem de seleção para ter a ordem correta
          selectedOfSameType.sort((a, b) => a.selectionOrder - b.selectionOrder);
          const currentIndex = selectedOfSameType.findIndex(sel => sel.complementId === c.complementId);
          
          let cost = 0;
          
          // Se este complemento está dentro do limite gratuito, não cobra
          if (currentIndex >= includedCount && c.isSelected) {
            // Complemento incluso que excede o limite gratuito
            cost = c.unitPrice;
          }
          
          // Adicionar custo dos extras (apenas para complementos não inclusos)
          cost += c.extraQuantity * c.unitPrice;
          
          return acc + cost;
        }
        return acc;
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
        // Verificar se este complemento será cobrado
        const includedCount = type === 'FRUTA' ? selectedVariation?.includedFruits : 
                             type === 'COBERTURA' ? selectedVariation?.includedCoverages : 
                             type === 'ACOMPANHAMENTO' ? selectedVariation?.includedComplements : 0;
        const selectedOfSameType = prev.filter(c => c.type === type && c.isSelected);
        
        if (selectedOfSameType.length >= (includedCount || 0)) {
          setAlertMessage(`O complemento "${name}" será cobrado R$ ${unitPrice.toFixed(2)} pois você já selecionou o limite de itens gratuitos.`);
          setShowAlert(true);
        }
        
        setSelectionCounter(prev => prev + 1);
        return [...prev, { complementId, name, type, isSelected: true, extraQuantity: 0, unitPrice, selectionOrder: selectionCounter + 1 }];
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
        setSelectionCounter(prev => prev + 1);
        return [...prev, { complementId, name, type, isSelected: false, extraQuantity: 1, unitPrice, selectionOrder: selectionCounter + 1 }];
      }
      return prev;
    });
  };

  const getComplementSelection = (complementId: string) => {
    return complementSelections.find(c => c.complementId === complementId) || { isSelected: false, extraQuantity: 0 };
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariation) return;
    
    setIsLoading(true);
    
    try {
      const cartItem = {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          imageUrl: product.imageUrl,
          active: product.active,
          createdAt: product.createdAt,
          variations: product.variations,
          complements: product.complements,
          categoryRelation: product.categoryRelation
        },
        selectedVariation,
        complementSelections,
        totalPrice
      };
      
      // Simular um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToCart(cartItem);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const allComplements = product.complements.map(pc => pc.complement);
  const includedComplements = allComplements.filter(c => c.included);
  const extraComplements = allComplements.filter(c => !c.included);

  const complementsByType = includedComplements.reduce((acc, c) => {
    if (!acc[c.type]) {
      acc[c.type] = [];
    }
    acc[c.type].push(c);
    return acc;
  }, {} as Record<string, Complement[]>);

  return (
    <>
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Cardápio
            </button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">{product.name}</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{product.description}</p>
          </div>

          {/* Seleção de Tamanho */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-purple-700">Escolha o tamanho:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`p-3 sm:p-4 border-2 rounded-lg text-center transition-all ${
                    selectedVariation?.id === variation.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-400'
                  }`}
                >
                  <div className="font-semibold text-sm sm:text-base">{variation.name}</div>
                  <div className="text-lg sm:text-xl font-bold text-purple-600">R$ {variation.basePrice.toFixed(2)}</div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Inclui {variation.includedComplements} acompanhamentos + {variation.includedFruits} fruta(s) + {variation.includedCoverages} cobertura(s) grátis
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Complementos Inclusos */}
          {selectedVariation && Object.entries(complementsByType).map(([type, complements]) => {
            const typeNames: Record<string, string> = {
              'ACOMPANHAMENTO': 'Acompanhamentos',
              'FRUTA': 'Frutas',
              'COBERTURA': 'Coberturas'
            };
            const includedCount = type === 'FRUTA' ? selectedVariation.includedFruits : 
                                  type === 'COBERTURA' ? selectedVariation.includedCoverages : 
                                  type === 'ACOMPANHAMENTO' ? selectedVariation.includedComplements : 0;


            return (
              <div key={type} className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-700">
                  {typeNames[type] || type}
                  <span className="text-xs sm:text-sm font-normal text-gray-600 ml-2">
                    ({includedCount} grátis inclusos)
                  </span>
                </h3>
                <div className="space-y-2">
                  {complements.map((complement) => {
                    const selection = getComplementSelection(complement.id);
                    const selectedOfSameType = complementSelections.filter(c => 
                      c.type === type && c.isSelected
                    ).sort((a, b) => a.selectionOrder - b.selectionOrder);
                    const currentIndex = selectedOfSameType.findIndex(c => c.complementId === complement.id);
                    const isFree = selection.isSelected && currentIndex < includedCount;

                    return (
                      <div key={complement.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`comp-${complement.id}`}
                            checked={selection.isSelected}
                            onChange={() => toggleComplement(complement.id, complement.name, complement.type, complement.extraPrice)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 rounded focus:ring-purple-500 flex-shrink-0"
                          />
                          <label htmlFor={`comp-${complement.id}`} className="font-medium text-sm sm:text-base flex-1">
                            {complement.name}
                            {isFree && <span className="text-green-600 text-xs sm:text-sm ml-2">(Grátis)</span>}
                            {selection.isSelected && !isFree && <span className="text-orange-600 text-xs sm:text-sm ml-2">(+ R$ {complement.extraPrice.toFixed(2)})</span>}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Extras Pagos (complementos não inclusos) */}
          {extraComplements.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700">Turbine seu açaí (Extras Pagos)</h3>
              <div className="space-y-2">
                {extraComplements.map(complement => {
                  const selection = getComplementSelection(complement.id);
                  return (
                    <div key={complement.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm sm:text-base block">{complement.name}</span>
                        <span className="text-xs sm:text-sm text-gray-600">+ R$ {complement.extraPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateExtraQuantity(complement.id, complement.name, complement.type, complement.extraPrice, -1)}
                          disabled={selection.extraQuantity === 0}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500 text-white flex items-center justify-center disabled:bg-gray-300 hover:bg-red-600 transition-colors"
                        >
                          <Minus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{selection.extraQuantity}</span>
                        <button
                          onClick={() => updateExtraQuantity(complement.id, complement.name, complement.type, complement.extraPrice, 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Espaçamento para o rodapé fixo */}
          <div className="h-24 sm:h-20"></div>
        </div>
      </main>

      {/* Rodapé Fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">R$ {totalPrice.toFixed(2)}</p>
              {selectedVariation && (
                <p className="text-xs text-gray-500">
                  Base: R$ {selectedVariation.basePrice.toFixed(2)} + Extras: R$ {(totalPrice - selectedVariation.basePrice).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariation || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-105 flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                  <span className="hidden sm:inline">Adicionando...</span>
                  <span className="sm:hidden">Adicionando</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Adicionar ao Carrinho</span>
                  <span className="sm:hidden">Adicionar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Alerta */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-white/20">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold">Atenção</h3>
            </div>
            <p className="text-gray-600 mb-4">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-white/20">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold text-green-700">Produto Adicionado!</h3>
            </div>
            <p className="text-gray-600 mb-6">Seu produto foi adicionado ao carrinho com sucesso.</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/checkout');
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Finalizar Pedido
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/');
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}