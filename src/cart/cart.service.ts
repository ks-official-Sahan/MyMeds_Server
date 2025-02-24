import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId, items: [] } });
    }
    return cart;
  }

  async addProduct(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.quantity)
      throw new BadRequestException('Insufficient stock');

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId, items: [] } });
    }
    const index = cart.items.findIndex((item) => item.productId === productId);
    if (index > -1) {
      const newQuantity = cart.items[index].quantity + quantity;
      if (newQuantity > product.quantity)
        throw new BadRequestException('Insufficient stock');
      cart.items[index].quantity = newQuantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    return this.prisma.cart.update({
      where: { userId },
      data: { items: cart.items },
    });
  }

  async updateProduct(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (quantity > product.quantity)
      throw new BadRequestException('Insufficient stock');

    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    const index = cart.items.findIndex((item) => item.productId === productId);
    if (index === -1) throw new NotFoundException('Product not in cart');
    if (quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }
    return this.prisma.cart.update({
      where: { userId },
      data: { items: cart.items },
    });
  }

  async removeProduct(userId: string, productId: string) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter((item) => item.productId !== productId);
    return this.prisma.cart.update({
      where: { userId },
      data: { items: cart.items },
    });
  }

  async clearCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');
    return this.prisma.cart.update({
      where: { userId },
      data: { items: [] },
    });
  }
}
