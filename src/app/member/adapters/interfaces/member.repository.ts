import { Inject } from "@nestjs/common";
import { MemberModel } from "../../core/models";

export type FindMemberBy = 'id' | 'email' | 'username';

export interface MemberRepository {
    findOne(by: FindMemberBy, value: string): Promise<MemberModel>;
    save(model: MemberModel): Promise<void>;
}
export const MEMBER_REPOSITORY = 'MEMBER_REPOSITORY';
export const InjectMemberRepo = () => Inject(MEMBER_REPOSITORY);