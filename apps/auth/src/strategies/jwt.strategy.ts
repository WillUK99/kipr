import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    protected readonly logger = new Logger(JwtStrategy.name);

    constructor(configService: ConfigService, private readonly usersService: UsersService) {
        super({
            // Inbound request can either be coming from express or a rpc call
            jwtFromRequest: ExtractJwt.fromExtractors([(req: any) => {
                return req?.cookies?.Authentication || req?.Authentication;
            }]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        } as StrategyOptionsWithoutRequest);
    }

    async validate({ userId }: TokenPayload) {
        return this.usersService.getUserById({ _id: userId });
    }
}