// File: src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddProductDto,
  UpdateProductDto,
  RemoveProductDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Get the cart for a given user.
  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    // If no cart exists, return an empty cart object.
    return cart || { id: null, userId, items: [] };
  }

  // Add a product to the cart.
  async addProduct(userId: string, addProductDto: AddProductDto) {
    const { productId, quantity } = addProductDto;
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      // Create a new cart for the user.
      cart = await this.prisma.cart.create({
        data: {
          userId,
          items: [{ productId, quantity }],
        },
        include: { items: true },
      });
      return cart;
    }

    // Check if product already exists in the cart.
    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );
    if (existingItem) {
      // Update quantity.
      const updatedQuantity = existingItem.quantity + quantity;
      await this.prisma.cart.update({
        where: { userId },
        data: {
          items: {
            updateMany: {
              where: { productId },
              data: { quantity: updatedQuantity },
            },
          },
        },
      });
    } else {
      // Add new item.
      await this.prisma.cart.update({
        where: { userId },
        data: {
          items: {
            push: { productId, quantity },
          },
        },
      });
    }

    return this.getCart(userId);
  }

  // Update the quantity of a product in the cart.
  async updateProduct(userId: string, updateProductDto: UpdateProductDto) {
    const { productId, quantity } = updateProductDto;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // If quantity is 0, remove the product.
    if (quantity === 0) {
      return this.removeProduct(userId, { productId });
    }

    // Otherwise, update the quantity.
    // Here, we rebuild the items array.
    const newItems = cart.items.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    return await this.prisma.cart.update({
      where: { userId },
      data: { items: newItems },
    });
  }

  // Remove a product from the cart.
  async removeProduct(userId: string, removeProductDto: RemoveProductDto) {
    const { productId } = removeProductDto;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const newItems = cart.items.filter((item) => item.productId !== productId);
    return await this.prisma.cart.update({
      where: { userId },
      data: { items: newItems },
    });
  }

  // Clear the cart.
  async clearCart(userId: string) {
    // Option 1: delete the cart entirely.
    // return await this.prisma.cart.delete({ where: { userId } });

    // Option 2: update cart items to an empty array.
    return await this.prisma.cart.update({
      where: { userId },
      data: { items: [] },
    });
  }
}
