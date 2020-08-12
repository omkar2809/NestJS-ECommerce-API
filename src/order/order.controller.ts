import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from 'src/types/user';
import { CreateOrderDTO } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async listOrder(@User() {id}: UserDocument) {
        return await this.orderService.listOrdersByUser(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createOrder(@User() {id}: UserDocument, @Body() order: CreateOrderDTO) {
        return this.orderService.createOrder(order, id);
    }
}
