'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            address: customerAddress,
          },
          cartItems,
          totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o pedido. Tente novamente.');
      }

      // Create WhatsApp message
      let message = `*Novo Pedido Recebido*

`;
      message += `*Cliente:* ${customerName}
`;
      message += `*Telefone:* ${customerPhone}
`;
      message += `*Endereço:* ${customerAddress}

`;
      message += `*Itens do Pedido:*
`;
      message += `-----------------------
`;

      cartItems.forEach(item => {
        message += `*Produto:* ${item.product.name} (${item.selectedVariation.name})
`;
        
        const included = item.complementSelections.filter(c => c.isSelected);
        if (included.length > 0) {
          message += `  *Inclusos:*
`;
          included.forEach(c => { message += `    - ${c.name}
`; });
        }

        const extras = item.complementSelections.filter(c => c.extraQuantity > 0);
        if (extras.length > 0) {
          message += `  *Extras:*
`;
          extras.forEach(c => { message += `    - ${c.name} (${c.extraQuantity}x)
`; });
        }
        message += `  *Subtotal:* R$ ${item.totalPrice.toFixed(2)}
`;
        message += `-----------------------
`;
      });

      message += `
*Total do Pedido:* R$ ${totalPrice.toFixed(2)}`;

      const phone = '5511999999999'; // Replace with actual number
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

      clearCart();
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order Summary */}
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

        {/* Customer Details */}
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
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço Completo</label>
              <textarea id="address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            <button 
                onClick={handleConfirmOrder}
                disabled={cartItems.length === 0 || !customerName || !customerPhone || !customerAddress || isLoading}
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
