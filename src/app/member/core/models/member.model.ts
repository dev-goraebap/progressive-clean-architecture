import { EMAIL_VERIFIED_EXPIRED_TIME } from "../rules";
import { AgreedPolicyVO, AuthTokenVO, AuthVO, SocialVO } from "../value-objects";

export class MemberModel {

    readonly id: string;
    readonly nickname: string;
    readonly email: string;
    readonly emailVerifiedAt: Date;
    readonly emailVerifyExpiredAt: Date;
    readonly auth?: AuthVO;
    readonly socials: SocialVO[] = [];
    readonly tokens: AuthTokenVO[] = [];
    readonly agreedPolicies: AgreedPolicyVO[] = [];
    readonly fileGroupId?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date;

    private constructor(prop: Partial<MemberModel>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static createWithAuth(prop: Pick<MemberModel, 'id' | 'nickname' | 'email' | 'agreedPolicies' | 'auth'>, authToken: AuthTokenVO) {
        const createdAt = new Date();
        const updatedAt = createdAt;
        const emailVerifyExpiredAt = new Date(EMAIL_VERIFIED_EXPIRED_TIME + createdAt.getTime());
        const deletedAt = null;
        return new MemberModel({
            id: prop.id,
            nickname: prop.nickname,
            email: prop.email,
            emailVerifiedAt: null,
            emailVerifyExpiredAt,
            auth: prop.auth,
            socials: [],
            agreedPolicies: prop.agreedPolicies,
            tokens: [authToken],
            createdAt,
            updatedAt,
            deletedAt,
        });
    }

    static createWithSocial(prop: Pick<MemberModel, 'id' | 'nickname' | 'email' | 'agreedPolicies'>, social: SocialVO, authToken: AuthTokenVO) {
        const createdAt = new Date();
        const updatedAt = createdAt;
        const emailVerifyExpiredAt = new Date(EMAIL_VERIFIED_EXPIRED_TIME + createdAt.getTime());
        const deletedAt = null;
        return new MemberModel({
            id: prop.id,
            nickname: prop.nickname,
            email: prop.email,
            emailVerifiedAt: null,
            emailVerifyExpiredAt,
            auth: null,
            socials: [social],
            agreedPolicies: prop.agreedPolicies,
            tokens: [authToken],
            createdAt,
            updatedAt,
            deletedAt,
        });
    }

    static fromPersistance(prop: MemberModel) {
        return new MemberModel(prop);
    }

}