'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Order, Customer, OrderItem, Product, ProductVariation, OrderItemComplement, Complement } from "@prisma/client";

// Recreate the extended types from the orders page
type OrderItemWithRelations = OrderItem & {
  product: Product;
  variation: ProductVariation | null;
  complements: (OrderItemComplement & { complement: Complement })[];
};

type OrderWithRelations = Order & {
  customer: Customer;
  items: OrderItemWithRelations[];
};

interface OrderDetailsDialogProps {
  order: OrderWithRelations;
  children: React.ReactNode;
}

export function OrderDetailsDialog({ order, children }: OrderDetailsDialogProps) {

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'confirmed': return 'secondary';
      case 'preparing': return 'destructive';
      case 'delivered': return 'outline';
      case 'canceled': return 'destructive';
      default: return 'default';
    }
  }

  const address = order.customer.address as any; // Cast to any to access properties

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Pedido de {order.customer.name}</span>
            <Badge variant={getStatusVariant(order.status)}>{order.status.toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Detalhes do Cliente</h3>
            <div className="text-sm space-y-1">
              <p><strong>Nome:</strong> {order.customer.name}</p>
              <p><strong>Telefone:</strong> {order.customer.phone}</p>
              <h4 className="font-semibold mt-3">Endereço de Entrega:</h4>
              {address ? (
                <address className="not-italic">
                  {address.street}, {address.number} {address.complement && `- ${address.complement}`}<br />
                  {address.neighborhood} - {address.city}/{address.state}<br />
                  CEP: {address.zipCode}
                  {address.reference && <><br/><strong>Ref:</strong> {address.reference}</>}
                </address>
              ) : (
                <p>Endereço não fornecido.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Detalhes do Pedido</h3>
            <div className="text-sm space-y-1">
                <p><strong>ID do Pedido:</strong> {order.id}</p>
                <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                <p><strong>Total:</strong> <span className="font-bold text-green-600">R$ {order.total.toFixed(2)}</span></p>
            </div>
          </div>
        </div>

        <div>
            <h3 className="font-semibold text-lg mb-2">Itens</h3>
            <div className="space-y-3">
                {order.items.map(item => (
                    <div key={item.id} className="p-3 border rounded-md">
                        <p className="font-semibold">{item.product.name} ({item.variation?.name})</p>
                        <div className="pl-4 text-sm">
                            {item.complements.filter(c => c.type === 'INCLUDED').length > 0 && (
                                <div>
                                    <strong>Inclusos:</strong>
                                    <span className="ml-1">{item.complements.filter(c => c.type === 'INCLUDED').map(c => c.complement.name).join(', ')}</span>
                                </div>
                            )}
                             {item.complements.filter(c => c.type === 'EXTRA').length > 0 && (
                                <div>
                                    <strong>Extras:</strong>
                                    <span className="ml-1">{item.complements.filter(c => c.type === 'EXTRA').map(c => `${c.complement.name} (x${c.quantity})`).join(', ')}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-right font-medium">Subtotal: R$ {item.finalPrice.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
