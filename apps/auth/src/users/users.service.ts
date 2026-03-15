import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    protected readonly logger = new Logger(UsersService.name);
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        try {
        const user = await this.usersRepository.create({
            ...createUserDto,
                password: await bcrypt.hash(createUserDto.password, 10),
            });
            return user;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            this.logger.warn(`Invalid password for email: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
        }
        return user
    }
}
