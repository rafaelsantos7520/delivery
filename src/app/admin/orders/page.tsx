'use client';

import { Order, Customer, OrderItem, Product, ProductVariation, OrderItemComplement, Complement } from "@prisma/client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Loading } from "@/components/ui/loading";

// Extend the Order type to include the relations
type OrderItemWithRelations = OrderItem & {
  product: Product;
  variation: ProductVariation | null;
  complements: (OrderItemComplement & { complement: Complement })[];
};

type OrderWithRelations = Order & {
  customer: Customer;
  items: OrderItemWithRelations[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>
      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
                <OrderDetailsDialog key={order.id} order={order}>
                    <TableRow className="cursor-pointer">
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>{order.status.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    </TableRow>
                </OrderDetailsDialog>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}