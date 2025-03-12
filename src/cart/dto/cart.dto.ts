import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number; // if 0, then the product can be removed
}

export class RemoveProductDto {
  @IsNotEmpty()
  @IsString()
  productId: string;
}
