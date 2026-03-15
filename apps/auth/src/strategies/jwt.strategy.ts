import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { UsersService } from "../users/users.service";
import type { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    protected readonly logger = new Logger(JwtStrategy.name);

    constructor(configService: ConfigService, private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.Authentication || req?.headers?.authorization;
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        } as StrategyOptionsWithoutRequest);
    }

    async validate({ userId }: TokenPayload) {
        return this.usersService.getUserById({ _id: userId });
    }
}