export class CreateOrderDto {
  id: string;
  orderId: string;
  items: { productId: string; quantity: number }[];
  totalPrice: number;
  delivery: number;
  status: string;
  timestamp: Date;
}
