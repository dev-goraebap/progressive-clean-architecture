import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyService {

    constructor() { }

    async validates(termsIds: string[]): Promise<string[]> {
        /**
         * Note
         * 
         * - 약관검증 로직 구현
         * - 검증 실패시 예외 처리
         * - 검증 성공시 termsIds 반환
         */
        return ['T01', 'T02', 'T03'];
    }
}