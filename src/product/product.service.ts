import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all products
  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  // Create a new product
  async createProduct(createProductDto: CreateProductDto) {
    const {
      name,
      price,
      dosage,
      categoryName,
      quantity,
      title,
      description,
      expiryDate,
      image,
      manufacturer,
    } = createProductDto;

    return this.prisma.product.create({
      data: {
        name,
        price,
        dosage,
        categoryName,
        quantity,
        title,
        description,
        expiryDate,
        image,
        manufacturer,
      },
    });
  }

  // Update an existing product (id is a string)
  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }
}
