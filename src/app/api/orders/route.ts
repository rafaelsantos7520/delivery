
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CartItem } from '@/context/CartContext';
import { OrderItemComplementType } from '@prisma/client';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variation: true,
            complements: {
              include: {
                complement: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, cartItems, totalPrice } = body;

    if (!customer || !cartItems || !totalPrice) {
      return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const { name, phone, address } = customer;

    if (!name || !phone || !address) {
      return new NextResponse(JSON.stringify({ message: "Missing required customer fields" }), { status: 400 });
    }

    const orderData = await prisma.$transaction(async (tx) => {
      let existingCustomer = await tx.customer.findFirst({
        where: { phone },
      });

      if (!existingCustomer) {
        existingCustomer = await tx.customer.create({
          data: {
            name,
            phone,
            address,
          },
        });
      } else {
        existingCustomer = await tx.customer.update({
            where: { id: existingCustomer.id },
            data: { name, address },
        });
      }

      const order = await tx.order.create({
        data: {
          customerId: existingCustomer.id,
          total: totalPrice,
          status: 'pending',
        },
      });

      for (const item of cartItems as CartItem[]) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            variationId: item.selectedVariation.id,
            finalPrice: item.totalPrice,
          },
        });

        const includedComplements = item.complementSelections.filter(c => c.isSelected);
        for (const c of includedComplements) {
          await tx.orderItemComplement.create({
            data: {
              orderItemId: orderItem.id,
              complementId: c.complementId,
              type: OrderItemComplementType.INCLUDED,
              quantity: 1,
              price: 0,
            },
          });
        }

        const extraComplements = item.complementSelections.filter(c => c.extraQuantity > 0);
        for (const c of extraComplements) {
          await tx.orderItemComplement.create({
            data: {
              orderItemId: orderItem.id,
              complementId: c.complementId,
              type: OrderItemComplementType.EXTRA,
              quantity: c.extraQuantity,
              price: c.unitPrice * c.extraQuantity,
            },
          });
        }
      }
      
      return order;
    });

    return NextResponse.json(orderData, { status: 201 });

  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
