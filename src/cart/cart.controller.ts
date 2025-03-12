import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import {
  AddProductDto,
  UpdateProductDto,
  RemoveProductDto,
} from './dto/cart.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.uid;
    return await this.cartService.getCart(userId);
  }

  @Post('add')
  async addProduct(@Req() req: AuthenticatedRequest, @Body() addProductDto: AddProductDto) {
    const userId = req.user.uid;
    return await this.cartService.addProduct(userId, addProductDto);
  }

  @Put('update')
  async updateProduct(
    @Req() req: AuthenticatedRequest,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const userId = req.user.uid;
    return await this.cartService.updateProduct(userId, updateProductDto);
  }

  @Delete('remove')
  async removeProduct(
    @Req() req: AuthenticatedRequest,
    @Body() removeProductDto: RemoveProductDto,
  ) {
    const userId = req.user.uid;
    return await this.cartService.removeProduct(userId, removeProductDto);
  }

  @Delete('clear')
  async clearCart(@Req() req: AuthenticatedRequest) {
    const userId = req.user.uid;
    return await this.cartService.clearCart(userId);
  }
}
