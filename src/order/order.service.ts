import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/types/order';
import { Model } from 'mongoose';
import { CreateOrderDTO } from './order.dto';

@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

    async listOrdersByUser(userId: string) {
        const orders = await this.orderModel.find({owner: Object(userId)}).populate('owner').populate('products.product');
        if(!orders) {
            throw new HttpException('No orders found',HttpStatus.NO_CONTENT);
        }
        return orders;
    }

    async createOrder(orderDTO: CreateOrderDTO, userId: string) {
        const createOrder = {
            owner: Object(userId),
            products: Object(orderDTO.products),
        };
        const {_id} = await this.orderModel.create(createOrder);

        let order = await this.orderModel.findById(_id).populate('owner').populate('products.product');

        const totalPrice  = order.products.reduce((acc,product) => {
            const price = product.quantity * Number(product.product.price);
            return acc = price;
        },0);

        await order.update({totalPrice});

        order = await this.orderModel.findById(_id).populate('owner').populate('products.product');

        return order;
    }
}
