import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll() {
        return this.userRepository.find();
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!user) throw new Error('User not found');
        return user;
    }

    async findUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!user) throw new Error('User not found');
        return user;
    }


    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });
        if (!user) throw new Error('User not found');
        return user;
    }

    async createUser(user: CreateUserDto) {
        const newUser = await this.userRepository.create(user);
        await this.userRepository.save(newUser);
        return newUser;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken
        });
    }

}
