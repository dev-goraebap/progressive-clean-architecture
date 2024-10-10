import { Inject } from "@nestjs/common";
import { MemberModel } from "../core/models";

export type FindOneByCriteria = {
    readonly id?: string;
    readonly username?: string;
    readonly email?: string;
}

export interface MemberRepository {
    findOne(criteria: FindOneByCriteria): Promise<MemberModel>;
    save(model: MemberModel): Promise<void>;
}
export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';
export const InjectMemberRepo = () => Inject(MEMBER_REPOSITORY);