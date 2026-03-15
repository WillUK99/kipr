import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "../users/models";

function getCurrentUserByContext(ctx: ExecutionContext): UserDocument {
    return ctx.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx));
