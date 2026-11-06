import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripTags } from "@/lib/slug";
import { OrderDTO, OrderItemDTO } from "@/lib/types";
import { CheckoutInput } from "@/lib/validators";

export class OrderError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function orderNumber(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KURO-${y}${m}${d}-${suffix}`;
}

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export function serializeOrder(order: OrderWithItems): OrderDTO {
  const items: OrderItemDTO[] = order.items.map((item) => ({
    id: item.id,
    product_name: item.productName,
    price_at_purchase: Number(item.priceAtPurchase),
    quantity: item.quantity,
  }));

  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_address: order.customerAddress,
    notes: order.notes,
    total_amount: Number(order.totalAmount),
    status: order.status,
    created_at: order.createdAt.toISOString(),
    items,
  };
}

export async function createOrder(input: CheckoutInput) {
  const customerName = stripTags(input.customer_name);
  const customerPhone = stripTags(input.customer_phone);
  const customerAddress = stripTags(input.customer_address);
  const notes = input.notes ? stripTags(input.notes) : null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const created = await prisma.$transaction(async (tx) => {
        const ids = input.items.map((item) => item.productId);
        const products = await tx.product.findMany({ where: { id: { in: ids } } });
        const byId = new Map(products.map((product) => [product.id, product]));

        let total = 0;
        const lines: {
          productId: number;
          productName: string;
          priceAtPurchase: Prisma.Decimal;
          quantity: number;
        }[] = [];

        for (const item of input.items) {
          const product = byId.get(item.productId);
          if (!product) throw new OrderError("Ada produk yang sudah tidak tersedia.", 400);

          const reserved = await tx.product.updateMany({
            where: { id: product.id, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (reserved.count !== 1) {
            throw new OrderError(`Stok ${product.name} tidak mencukupi.`, 400);
          }

          const price = new Prisma.Decimal(product.price);
          total += Number(price) * item.quantity;
          lines.push({
            productId: product.id,
            productName: product.name,
            priceAtPurchase: price,
            quantity: item.quantity,
          });
        }

        return tx.order.create({
          data: {
            orderNumber: orderNumber(),
            customerName,
            customerPhone,
            customerAddress,
            notes: notes || null,
            totalAmount: total.toFixed(2),
            items: { create: lines },
          },
          include: { items: true },
        });
      });

      return serializeOrder(created);
    } catch (error) {
      if (error instanceof OrderError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < 4) {
        continue;
      }
      throw error;
    }
  }

  throw new OrderError("Nomor pesanan bentrok. Coba sekali lagi.", 500);
}
