import { Injectable } from '@nestjs/common';
import { UserService } from 'src/shared/user.service';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/types/payload';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async signPayload(payload: Payload) {
        return sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
    }

    async validateUser(payload: Payload) {
        return await this.userService.findByPayload(payload);
    }
}
