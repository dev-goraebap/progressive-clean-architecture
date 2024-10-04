import { SocialProviders } from "../types";

export class SocialVO {
    readonly providerId: string;
    readonly providerType: SocialProviders;
    readonly createdAt: Date;

    private constructor(prop: Partial<SocialVO>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static create(prop: Partial<SocialVO>) {
        return new SocialVO({
            ...prop,
            createdAt: new Date()
        });
    }
}