import { Controller, Get, Post, Put, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Req() req) {
    const userId = req.user.uid;
    return await this.cartService.getCart(userId);
  }

  @Post('add')
  async addProduct(@Req() req, @Body() dto: AddCartItemDto) {
    const userId = req.user.uid;
    return await this.cartService.addProduct(userId, dto.productId, dto.quantity);
  }

  @Put('update')
  async updateProduct(@Req() req, @Body() dto: UpdateCartItemDto) {
    const userId = req.user.uid;
    return await this.cartService.updateProduct(userId, dto.productId, dto.quantity);
  }

  @Delete('remove')
  async removeProduct(@Req() req, @Body() dto: RemoveCartItemDto) {
    const userId = req.user.uid;
    return await this.cartService.removeProduct(userId, dto.productId);
  }

  @Delete('clear')
  async clearCart(@Req() req) {
    const userId = req.user.uid;
    return await this.cartService.clearCart(userId);
  }
}
