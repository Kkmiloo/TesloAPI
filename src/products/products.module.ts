import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImage, Product } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  exports: [ProductsService, TypeOrmModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), AuthModule],
})
export class ProductsModule {}
