import { Logger } from "@nestjs/common";
import axios from "axios";

// Discord로 에러 로그를 전송하는 함수
export async function sendErrorToDiscord(logMessage: string) {
    const url = 'https://discord.com/api/webhooks/1291038253583040553/R7wgLoD9MAeve11ZYxniBNYi2erqajiybjofvLZBT8GGygX8plNx8fF9W1FLw1Hc-MDP';
    try {
        await axios.post(url, {
            content: `
            ### 시스템 에러 발생\n${logMessage}
            `,
        });
    } catch (error) {
        Logger.error('Failed to send log to Discord', error);
    }
};