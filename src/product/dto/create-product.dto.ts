export class CreateProductDto {
  name: string;
  title: string;
  description?: string;
  image?: string;
  categoryName: string;
  dosage: string;
  price: string;
  quantity: number;
  manufacturer?: string;
  expiryDate?: string;
}

