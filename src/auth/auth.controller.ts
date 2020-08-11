import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Payload } from 'src/types/payload';
import { User } from 'src/utilities/user.decorator';
import { SellerGuard } from 'src/guards/seller.guard';

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async findAll(@User() user) {
        console.log(user);
        return await this.userService.findAll();
    }

    @Post('login')
    async login(@Body() userDTO: LoginDTO) {
        const user =  await this.userService.findByLogin(userDTO);
        const payload: Payload = {
            username: user.username,
            seller: user.seller,
        }

        const token = await this.authService.signPayload(payload);
        return {user, token};
    }

    @Post('register')
    async register(@Body() userDTO: RegisterDTO) {
        const user =  await this.userService.create(userDTO);
        const payload: Payload = {
            username: user.username,
            seller: user.seller,
        }

        const token = await this.authService.signPayload(payload);
        return {user, token};
    }
}
