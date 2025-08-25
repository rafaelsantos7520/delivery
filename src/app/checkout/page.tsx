'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Trash2, Info } from 'lucide-react';
import { comerceData } from '@/utils/comerceData';

interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
}

export default function CheckoutPage() {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState<Address>({
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    reference: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const zipCode = e.target.value.replace(/\D/g, '');
    if (zipCode.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError('CEP não encontrado.');
        return;
      }
      setAddress(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Falha ao buscar o CEP.');
    }
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: customerName,
            phone: customerPhone,
            address: address,
          },
          cartItems,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar o pedido. Tente novamente.');
      }

      let message = `*Novo Pedido Recebido*\n\n`;
      message += `*Cliente:* ${customerName}\n`;
      message += `*Telefone:* ${customerPhone}\n`;
      message += `*Endereço:*\n`;
      message += `  - CEP: ${address.zipCode}\n`;
      message += `  - Rua: ${address.street}, Nº: ${address.number}\n`;
      message += `  - Bairro: ${address.neighborhood}\n`;
      message += `  - Cidade/UF: ${address.city}/${address.state}\n`;
      if(address.complement) message += `  - Complemento: ${address.complement}\n`;
      if(address.reference) message += `  - Ponto de Referência: ${address.reference}\n`;
      message += `\n*Itens do Pedido:*\n`;
      message += `-----------------------\n`;

      cartItems.forEach(item => {
        message += `*Produto:* ${item.product.name} (${item.selectedVariation.name})\n`;
        const included = item.complementSelections.filter(c => c.isSelected);
        if (included.length > 0) {
          message += `  *Inclusos:* ${included.map(c => c.name).join(', ')}\n`;
        }
        const extras = item.complementSelections.filter(c => c.extraQuantity > 0);
        if (extras.length > 0) {
          message += `  *Extras:* ${extras.map(c => `${c.name} (x${c.extraQuantity})`).join(', ')}\n`;
        }
        message += `  *Subtotal:* R$ ${item.totalPrice.toFixed(2)}\n`;
        message += `-----------------------\n`;
      });

      message += `\n*Total (produtos):* R$ ${totalPrice.toFixed(2)}`;
      message += `\n*Taxa de entrega a ser informada.*`;

      const phone = comerceData.whatsapp; // Replace with actual number
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

      clearCart();
      router.push('/');

    } catch (err) {
       if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = customerName && customerPhone && address.zipCode && address.street && address.number && address.neighborhood && address.city && address.state;

  if (!hasMounted) {
    return (
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-8">Checkout</h1>
          <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">Resumo do Pedido</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Seu carrinho está vazio.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{item.product.name} - {item.selectedVariation.name}</h3>
                    <div className="text-sm text-gray-600 ml-4">
                        {item.complementSelections.filter(c => c.isSelected).map(c => c.name).join(', ')}
                    </div>
                     <div className="text-sm text-blue-600 ml-4">
                        {item.complementSelections.filter(c => c.extraQuantity > 0).map(c => `${c.name} (x${c.extraQuantity})`).join(', ')}
                    </div>
                    <p className="font-semibold mt-2">R$ {item.totalPrice.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">Seus Dados</h2>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
              <input type="text" id="phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
                    <input type="text" name="zipCode" id="zipCode" value={address.zipCode} onChange={handleAddressChange} onBlur={handleCepBlur} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                    <p className="text-xs text-gray-500 mt-1">Preencha para buscar o endereço automaticamente.</p>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">Rua</label>
                    <input type="text" name="street" id="street" value={address.street} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">Número</label>
                    <input type="text" name="number" id="number" value={address.number} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="sm:col-span-4">
                    <label htmlFor="complement" className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input type="text" name="complement" id="complement" value={address.complement} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input type="text" name="neighborhood" id="neighborhood" value={address.neighborhood} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="sm:col-span-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input type="text" name="city" id="city" value={address.city} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                    <input type="text" name="state" id="state" value={address.state} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
                 <div className="sm:col-span-6">
                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Ponto de Referência</label>
                    <input type="text" name="reference" id="reference" value={address.reference} onChange={handleAddressChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
                </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total (produtos):</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center p-3 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
                <Info className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <span className="sr-only">Info</span>
                <div>
                    A taxa de entrega será informada via WhatsApp.
                </div>
            </div>
            <button 
                onClick={handleConfirmOrder}
                disabled={!isFormValid || cartItems.length === 0 || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              {isLoading ? 'Finalizando...' : 'Finalizar Pedido e Enviar via WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}