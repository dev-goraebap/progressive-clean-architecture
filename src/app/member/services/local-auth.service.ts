import { BadRequestException, Injectable } from "@nestjs/common";

import { MailService } from "src/shared/mail";
import { InjectMemberRepo, MemberRepository } from "../adapters/interfaces";
import { MemberModel } from "../core/models";
import { AgreedPolicyVO, AuthTokenVO, AuthVO } from "../core/value-objects";
import { RegisterLocalMemberDTO } from "../dto";

@Injectable()
export class LocalAuthService {

    constructor(
        private readonly emailHelper: MailService,
        @InjectMemberRepo() private readonly memberRepository: MemberRepository,
    ) { }

    async register(dto: RegisterLocalMemberDTO) {
        // STEP - 요청 파라미터 유효성 검증
        const { nickname, email, username, password, policyIds } = dto;

        // STEP - 아이디 중복 검증
        let conflictMember = await this.memberRepository.findOne('username', username);
        if (conflictMember) throw new BadRequestException('이미 존재하는 아이디 입니다.');

        // STEP - 이메일 중복 검증
        conflictMember = await this.memberRepository.findOne('email', email);
        if (conflictMember) throw new BadRequestException('사용중인 이메일 입니다.');

        // STEP - 회원도메인 생성
        const memberId = new Date().getTime().toString();
        const auth = AuthVO.create({ username, password });
        const agreedPolicies = policyIds.map((id: string) => AgreedPolicyVO.create(id));
        const authToken = AuthTokenVO.create('123123');
        const member = MemberModel.createWithAuth({
            id: memberId,
            email,
            nickname,
            agreedPolicies,
            auth,
        }, authToken);

        // STEP - 회원 저장
        await this.memberRepository.save(member);

        // STEP - 회원 인증이메일 전송(완료)
        return await this.emailHelper.sendMemberVerifyTemplate(email, authToken.src);
    }
}