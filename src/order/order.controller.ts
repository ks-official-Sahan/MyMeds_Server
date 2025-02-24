// order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('orders')
@UseGuards(FirebaseAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    const userId = req.user.uid;
    return await this.orderService.createOrder(userId, dto);
  }

  @Get()
  async getOrders(@Req() req) {
    const userId = req.user.uid;
    return await this.orderService.getOrders(userId);
  }

  @Put('/status')
  async updateOrderStatus(@Req() req, @Body() dto: UpdateOrderStatusDto) {
    const userId = req.user.uid;
    return await this.orderService.updateOrderStatus(userId, dto);
  }

  @Delete(':orderId')
  async deleteOrder(@Req() req, @Param('orderId') orderId: string) {
    const userId = req.user.uid;
    return await this.orderService.deleteOrder(userId, orderId);
  }
}
