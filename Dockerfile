# 1. Node.js 최신 LTS 버전인 20.x 버전 사용
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json과 package-lock.json을 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install --only=production

# 5. 애플리케이션 소스 코드 복사
COPY . .

# 6. NestJS 프로덕션 빌드를 위한 빌드 단계 (TypeScript 컴파일)
RUN npm run build

# 7. 포트를 외부에 노출
EXPOSE 80

# 8. 프로덕션 환경에서 실행
CMD ["npm", "run", "start:prod"]
