import { ApiProperty } from "@nestjs/swagger";

export class OAuthProfileViewModel {
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly email?: string;

    @ApiProperty()
    readonly nickname?: string;

    @ApiProperty()
    readonly profileImageUrl?: string;
}