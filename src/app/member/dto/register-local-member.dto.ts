import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsString, Matches } from 'class-validator';
import { EMAIL_REGEX, NICKNAME_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from '../core/rules';

export class RegisterLocalMemberDTO {

    @IsString()
    @Matches(NICKNAME_REGEX, { message: 'Invalid nickname format' })
    @ApiProperty({ default: '든든한고래밥' })
    readonly nickname: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @Matches(EMAIL_REGEX, { message: 'Invalid email format' })
    @ApiProperty({ default: 'dev.goraebap@gmail.com' })
    readonly email: string;

    @IsString()
    @Matches(USERNAME_REGEX, { message: 'Invalid username format' })
    @ApiProperty({ default: 'test888' })
    readonly username: string;

    @IsString()
    @Matches(PASSWORD_REGEX, { message: 'Password must be at least 8 characters long and include letters, numbers, and special characters' })
    @ApiProperty({ default: '1q2w3e4r5t!@' })
    readonly password: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'policyIds must contain at least one item' })
    @ApiProperty({ default: ['T001', 'T002'] })
    readonly policyIds: string[];
}
