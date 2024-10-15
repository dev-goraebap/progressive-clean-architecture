import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

import { EnvConfig } from "src/shared/config";
import { JusogoViewModel } from "../core/models";

/**
 * Note: 
 * 주소기반산업지원서비스
 * 대한민국 주소 검색을 편하게 도와주는 무료 공급업체
 * https://business.juso.go.kr/addrlink/main.do
 */
@Injectable()
export class JusogoService {

    private readonly logger = new Logger(JusogoService.name);

    private readonly key: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.key = this.configService.get('JUSOGO_KEY');
    }

    async search(keyword: string) {
        const params = new URLSearchParams();
        params.set('confmKey', this.key);
        params.set('resultType', 'json');
        params.set('keyword', keyword);

        const res = await axios.get('https://business.juso.go.kr/addrlink/addrLinkApi.do', {
            params
        }).catch(err => {
            const errResult = err?.response?.data;
            this.logger.log(JSON.stringify(errResult));
            throw new BadRequestException(`주소 검색 중 오류가 발생했습니다: ${errResult?.errorMessage}`);
        });

        return res.data as JusogoViewModel;
    }
}