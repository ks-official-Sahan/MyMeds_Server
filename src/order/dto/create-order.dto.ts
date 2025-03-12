export class CreateOrderDto {
  id: string;
  orderId: string;
  orderItems: {
    product: { id: string }; // expect only the nested product object
    quantity: number;
  }[];
  totalPrice: number;
  delivery: number;
  status: string;
  timestamp: number;
}
