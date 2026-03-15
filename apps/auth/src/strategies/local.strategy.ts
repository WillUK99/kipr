import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    protected readonly logger = new Logger(LocalStrategy.name);
    constructor(private readonly userService: UsersService) {
        super({
            usernameField: 'email',
        });
    }

    async validate(email: string, password: string) {
        try {
            const user = await this.userService.validateUser(email, password);
            if (!user) {
                this.logger.warn(`Invalid credentials for email: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }
            return user;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException(error);
        }
    }
}