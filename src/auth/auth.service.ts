import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) { }

    async registerUser(registerUserDto: RegisterDto) {

        const saltRounds = 10
        const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
        /**
         * 1. check if user already exists or not
         * 2. hash password
         * 3. store the user into db
         * 4. genrate JWT token
         * 5. send token into response
         */

        const user = await this.userService.createUser({ ...registerUserDto, password: hash });
        const payload = { sub: user?._id }
        const token = await this.jwtService.signAsync(payload)
        console.log("token", token)
        return { access_token: token }
    }
}