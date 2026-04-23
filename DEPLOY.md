# 배포 가이드 (Render + Supabase)

## 1. Supabase — PostgreSQL

1. [Supabase](https://supabase.com)에서 프로젝트 생성.
2. **Settings → Database**에서 JDBC 연결 정보와 비밀번호를 확인합니다.
3. `DB_URL` 예:  
   `jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require`
4. 이 앱은 **Auth는 사용하지 않고** DB(Postgres)와 Storage만 사용합니다.

## 2. Supabase — Storage (이미지)

1. **Storage**에서 버킷 생성(이름을 `SUPABASE_STORAGE_BUCKET`과 맞출 것).
2. 이미지를 **프론트에 URL로 직접** 보여줄 경우 버킷을 **Public**으로 두는 것이 단순합니다(또는 `SUPABASE_STORAGE_PUBLIC=true` + Public 정책).
3. **Project Settings → API**에서:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (서버/Render에만 설정, **클라이언트에 넣지 않기**)
4. 앱은 서버가 `POST /storage/v1/object/...`로 **직접 업로드**하며, 공개 URL은 `.../storage/v1/object/public/{bucket}/...` 형식입니다.

## 3. Render (백엔드)

### Blueprint (`render.yaml`)

- Git 연동 후 Blueprint로 `render.yaml`을 적용합니다.
- `sync: false`인 항목은 Render 대시보드에서 수동으로 채웁니다.

### 수동 Web Service

- **Root Directory**: `backend`
- **Dockerfile**: `backend/Dockerfile`
- **Health check**: `/actuator/health`
- 환경 변수는 `backend/.env.example`을 참고합니다.

## 4. 프론트 (Vite)

- `client/.env.example` 복사 후:  
  `VITE_API_BASE_URL=https://<배포된-API-호스트>`
- 빌드: `npm run build:client`
- 배포 시 **Publish** 디렉터리(이 프로젝트 Vite): **`dist/public`**

## 5. 체크리스트

- [ ] `DB_URL`에 `sslmode=require`
- [ ] `APP_CORS_ORIGINS`에 실제 프론트 URL
- [ ] `SUPABASE_JWT_SECRET`이 배포/로컬에서 앱이 기대하는 값과 일치
- [ ] Storage 버킷 존재, Service role이 업로드 권한을 갖는지(기본 service role)
- [ ] `GET https://<api>/actuator/health` → 200
