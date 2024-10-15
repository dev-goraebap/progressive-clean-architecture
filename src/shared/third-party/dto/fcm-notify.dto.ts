import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FcmNotifyDTO {
    @IsOptional()
    @ApiProperty({
        default: [
            "dfEeIgwYGU2gmDSiLW79h0:APA91bF0LhtEpimyOHGhiBVzZjnB3JVZhmyl4jtufN-jc03JCF59hMQpgsKQ1fssO8g7d_-NZXmUnF22_NgG2Je0jPj_3_5Fdopf4eWLuWXkaw25ZsX3xkjLzUaFwpWLLm-0NNOCT5Fy",
            "c1PVM39DRRWe6hiwhvlbIA:APA91bHj_Fw7vCnARPh6V1U4AaUZwXr03EM3cI5WQeY8BZEtlir6VzzwCwEeBEQwDvea98nZVR-owNkifL7QOLKTDZMMZAVXST9PdWAiWD7rw2oYEGAhfOYYmdHjl_L7mGVVuAzkW9bU"
        ]
    })
    readonly fcmTokens: string[];

    @IsNotEmpty()
    @ApiProperty({ default: 'FCM 알림 타이틀' })
    readonly title: string;

    @IsNotEmpty()
    @ApiProperty({ default: 'FCM 알림 내용'})
    readonly content: string;

    @IsOptional()
    @ApiProperty({ default: {
        type: 'NOTICE',
        meta: JSON.stringify({
            id: 'N0001',
            prop1: 'PROP1',
            prop2: 'PROP2'
        })
    }, description: '요구사항에 따른 메타 데이터' })
    readonly data: any;
}