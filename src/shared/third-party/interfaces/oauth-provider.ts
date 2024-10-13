export enum OAuthProviders {
    KAKAO = 'kakao',
    GOOGLE = 'google',
    NAVER = 'naver',
    APPLE = 'apple',
    DISCORD = 'discord',
}

export type AuthorizedResult = {
    provider: OAuthProviders;
    accessToken: string;
    /** 엑세스토큰만료시간 (UTC 날짜) */
    expiresAt: Date;
    errMsg?: string;
}

export type OAuthProfile = {
    id: string;
    email?: string;
    nickname?: string;
    profileImageUrl?: string;
}

/**
 * Note:
 * OAuth 인증 제공자의 기능을 제공하는 인터페이스.
 */
export interface OAuthProvider {
    /**
     * Note:
     * 인증기관의 clientID등의 정보를 백엔드서버에서 응집되게 관리하기 위하여
     * 완성된 로그인페이지접속URL을 반환하는 메소드를 정의함.
     * - 단말기에서 SDK를 통해 토큰을 발급받는 경우 사용되지 않음
     */
    getLoginUrl(): string;

    /**
     * Note:
     * - 단말기에서 SDK를 통해 토큰을 발급받는 경우 사용되지 않음
     */
    authorize(code: string): Promise<AuthorizedResult>;

    getProfile(token: string): Promise<OAuthProfile>;

    logout(): Promise<void>;
}