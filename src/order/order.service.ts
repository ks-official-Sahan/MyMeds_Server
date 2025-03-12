import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const oid = dto.orderId || dto.id;
    
    const order = await this.prisma.order.create({
      data: {
        orderId: oid,
        userId,
        orderItems: (dto.orderItems || []).map((item) => ({
          productId: item.product.id, // extract id from the nested product object
          quantity: item.quantity,
        })),
        totalPrice: dto.totalPrice,
        delivery: dto.delivery,
        status: dto.status,
        timestamp: dto.timestamp,
      },
    });

    return order;
  }

  async getOrders(userId: string) {
    const orders = await this.prisma.order.findMany({ where: { userId } });

    // Collect all product IDs from order items
    const productIds = orders.flatMap((order) =>
      order.orderItems.map((item) => item.productId),
    );

    // Retrieve product details in one query
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Map product details into each order's orderItems
    const ordersWithProductInfo = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: products.find((prod) => prod.id === item.productId),
      })),
    }));

    return ordersWithProductInfo;
  }

  async updateOrderStatus(userId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findFirst({
      where: { orderId: dto.orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.update({
      where: { id: order.id },
      data: { status: dto.status },
    });
  }

  async deleteOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { orderId, userId },
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.prisma.order.delete({ where: { id: order.id } });
  }
}
