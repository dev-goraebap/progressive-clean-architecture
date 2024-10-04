import { AUTH_TOKEN_EXPIRED_TIME } from "../rules";

export class AuthTokenVO {
    readonly src: string;
    readonly createdAt: Date;
    readonly expiredAt: Date;

    private constructor(prop: Partial<AuthTokenVO>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static create(src: string) {
        const createdAt = new Date();
        return new AuthTokenVO({
            src,
            createdAt,
            expiredAt: new Date(AUTH_TOKEN_EXPIRED_TIME + createdAt.getTime())
        });
    }
}