// order/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    let oid = dto.orderId ? dto.orderId : dto.id;
    return this.prisma.order.create({
      data: {
        orderId: oid,
        userId,
        items: dto.items,
        totalPrice: dto.totalPrice,
        delivery: dto.delivery,
        status: dto.status,
        timestamp: dto.timestamp,
      },
    });
  }

  async getOrders(userId: string) {
    return this.prisma.order.findMany({ where: { userId } });
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
