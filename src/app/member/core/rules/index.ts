/** 이메일 인증 만료시간(7일) */
export const EMAIL_VERIFIED_EXPIRED_TIME = 1000 * 60 * 60 * 24 * 7;

/** 리프레시토큰 만료시간(7일) */
export const AUTH_TOKEN_EXPIRED_TIME = 1000 * 60 * 60 * 24 * 7;

/** 이메일 정규식: 일반적인 이메일 형식을 검증 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** 아이디 정규식: 4~16자의 영문, 숫자만 허용 */
export const USERNAME_REGEX = /^[a-zA-Z0-9]{4,16}$/;

/** 닉네임 정규식: 2~20자의 한글, 영문, 숫자, 밑줄(_)만 허용 */
export const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣_]{2,20}$/;

/** 패스워드 정규식: 최소 8자, 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합 */
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;