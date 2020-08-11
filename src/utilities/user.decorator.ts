// import { createParamDecorator } from '@nestjs/common';

// export const User = createParamDecorator((data, req) => req.user);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);