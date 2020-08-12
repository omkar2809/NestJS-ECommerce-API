import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/types/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { User } from 'src/types/user';

@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private productModel: Model<Product>) {}

    async findAll(): Promise<Product[]> {
        return await this.productModel.find().populate('owner').exec();
    }

    async findOne(id: string): Promise<Product> {
        const product =  await this.productModel.findById(id).populate('owner').exec();
        if(!product){
            throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
        }
        return product;
    }

    async findByOwner(userId: string): Promise<Product[]> {
        return await this.productModel.find({owner: Object(userId)}).populate('owner');
    }

    async create(productDTO: any, user: User): Promise<Product> {
        const product = await this.productModel.create({
            ...productDTO,
            owner: user
        });
        await product.save();
        return product.populate('owner');
    }

    async update(id: string, productDTO: UpdateProductDTO, userId: string): Promise<Product> {
        const product = await this.productModel.findById(id);
        if(userId !== product.owner.toString()) {
            throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
        }
        await product.update(productDTO);
        return await this.productModel.findById(id).populate('owner');
    }

    async delete(id: string, userId: string): Promise<Product> {
        const product = await this.productModel.findById(id);
        if(userId !== product.owner.toString()) {
            throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
        }
        await product.remove();
        return product.populate('owner');
    }
}
