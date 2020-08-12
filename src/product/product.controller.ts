import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { SellerGuard } from 'src/guards/seller.guard';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from 'src/types/user';
import { Product } from 'src/types/product';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get()
    async listAll(): Promise<Product[]> {
        return this.productService.findAll();
    }

    @Get('/mine')
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async listMine(@User() user: UserDocument): Promise<Product[]> {
        const {id: userId} = user;
        return this.productService.findByOwner(userId);
    }

    @Get('/seller/:id') 
    @UseGuards(AuthGuard('jwt'), SellerGuard) 
    async listBySeller(@Param('id') id: string): Promise<Product[]> {
        return this.productService.findByOwner(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async create(@Body() productDTO: CreateProductDTO, @User() user: UserDocument): Promise<Product> {
        return this.productService.create(productDTO, user);
    }

    @Get(':id')
    async read(@Param('id') id: string): Promise<Product> {
        return this.productService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async update(@Param('id') id: string, @Body() productDTO: UpdateProductDTO, @User() user: UserDocument): Promise<Product> {
        const {id: userId} = user;
        return this.productService.update(id, productDTO, userId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async delete(@Param('id') id: string, @User() user: UserDocument): Promise<Product> {
        const {id: userId} = user;
        return this.productService.delete(id, userId);
    }
}
