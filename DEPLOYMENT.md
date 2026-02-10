# 배포 가이드

이 가이드는 서울 청년 정책 추천 서비스를 Fly.io(백엔드)와 GitHub Pages(프론트엔드)에 배포하는 방법을 설명합니다.

## 📋 사전 준비

### 1. 필요한 계정
- **Fly.io 계정**: https://fly.io/app/sign-up
- **GitHub 계정**: https://github.com

### 2. 필요한 도구 설치
- **Fly CLI**: https://fly.io/docs/hands-on/install-flyctl/
- **Git**: https://git-scm.com/downloads

---

## 🚀 백엔드 배포 (Fly.io)

### 1단계: Fly.io CLI 설치 및 로그인

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**로그인:**
```bash
flyctl auth login
```

### 2단계: 앱 생성 및 배포

프로젝트 루트 디렉토리에서:

```bash
cd seoul-youth-policies

# Fly.io 앱 생성 (최초 1회만)
flyctl launch --no-deploy

# 앱 이름 입력: seoul-youth-policies-api (또는 원하는 이름)
# 리전 선택: Tokyo (nrt) 권장
# PostgreSQL 설정: No
# Redis 설정: No

# 배포
flyctl deploy

# 배포 상태 확인
flyctl status

# 로그 확인
flyctl logs
```

### 3단계: 배포 확인

```bash
# 앱 열기
flyctl open

# 또는 브라우저에서 직접 접속
# https://seoul-youth-policies-api.fly.dev/docs
```

### 백엔드 URL 확인
배포된 백엔드 URL은 다음과 같은 형식입니다:
```
https://[YOUR-APP-NAME].fly.dev
```

예: `https://seoul-youth-policies-api.fly.dev`

---

## 🌐 프론트엔드 배포 (GitHub Pages)

### 1단계: GitHub 저장소 생성

1. GitHub에서 새 저장소 생성
2. 저장소 이름: `seoul-youth-policies` (또는 원하는 이름)
3. Public으로 설정

### 2단계: 코드 푸시

```bash
cd seoul-youth-policies

# Git 초기화 (아직 안 했다면)
git init

# 원격 저장소 연결
git remote add origin https://github.com/[YOUR-USERNAME]/seoul-youth-policies.git

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Seoul Youth Policy Recommender"

# 푸시
git push -u origin main
```

### 3단계: GitHub Pages 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Pages** 클릭
3. **Source**에서 **GitHub Actions** 선택

### 4단계: package.json 수정

`frontend/package.json` 파일을 열고 다음 줄을 추가:

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "homepage": "https://[YOUR-GITHUB-USERNAME].github.io/seoul-youth-policies",
  ...
}
```

예시:
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "homepage": "https://yourusername.github.io/seoul-youth-policies",
  ...
}
```

### 5단계: API URL 시크릿 설정 (선택사항)

만약 Fly.io의 앱 이름을 변경했다면:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `API_URL`
4. Value: `https://[YOUR-FLY-APP-NAME].fly.dev`
5. **Add secret** 클릭

### 6단계: 배포 트리거

```bash
# package.json 변경사항 커밋
git add frontend/package.json
git commit -m "Add homepage for GitHub Pages"
git push

# 프론트엔드 변경사항 푸시하면 자동 배포됨
```

### 7단계: 배포 확인

1. GitHub 저장소 → **Actions** 탭
2. 워크플로우 실행 확인
3. 완료되면 다음 URL에서 확인:
   ```
   https://[YOUR-USERNAME].github.io/seoul-youth-policies
   ```

---

## 🔧 환경 변수

### 백엔드 (Fly.io)

필요한 경우 환경 변수 설정:

```bash
flyctl secrets set KEY=VALUE
```

### 프론트엔드 (GitHub Actions)

GitHub 저장소 시크릿에서 설정:
- `API_URL`: 백엔드 API URL (기본값: https://seoul-youth-policies-api.fly.dev)

---

## 📊 모니터링 및 로그

### Fly.io 로그 확인

```bash
# 실시간 로그
flyctl logs

# 특정 앱의 로그
flyctl logs -a seoul-youth-policies-api
```

### GitHub Actions 로그 확인

1. GitHub 저장소 → **Actions** 탭
2. 실행된 워크플로우 클릭
3. 각 단계별 로그 확인

---

## 🔄 업데이트 및 재배포

### 백엔드 업데이트

```bash
cd seoul-youth-policies

# 코드 수정 후
flyctl deploy
```

### 프론트엔드 업데이트

```bash
cd seoul-youth-policies

# 코드 수정 후
git add .
git commit -m "Update: description"
git push

# GitHub Actions가 자동으로 재배포
```

---

## 🐛 트러블슈팅

### 백엔드 배포 실패

**문제**: `failed to fetch an image or build from source`

**해결**:
```bash
# Dockerfile 경로 확인
cat fly.toml

# 빌드 로그 확인
flyctl deploy --verbose
```

**문제**: `health check failed`

**해결**:
```bash
# 헬스 체크 엔드포인트 확인
curl https://[YOUR-APP].fly.dev/health

# 로그 확인
flyctl logs
```

### 프론트엔드 배포 실패

**문제**: GitHub Actions 실패

**해결**:
1. Actions 탭에서 오류 로그 확인
2. `package.json`의 `homepage` 설정 확인
3. Node 버전 호환성 확인

**문제**: API 연결 오류 (CORS)

**해결**:
백엔드 `main.py`에서 CORS 설정 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 구체적인 도메인으로 변경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 💰 비용

### Fly.io
- **무료 티어**: 월 3개의 shared-cpu VM 무료
- **자동 슬립**: 트래픽 없을 때 자동으로 정지하여 비용 절감
- 자세한 정보: https://fly.io/docs/about/pricing/

### GitHub Pages
- **완전 무료**: Public 저장소 무제한 호스팅

---

## 🔗 유용한 링크

### Fly.io
- 문서: https://fly.io/docs/
- 대시보드: https://fly.io/dashboard

### GitHub Pages
- 문서: https://docs.github.com/en/pages
- GitHub Actions 문서: https://docs.github.com/en/actions

---

## 📝 체크리스트

배포 전 확인사항:

### 백엔드
- [ ] Fly.io 계정 생성
- [ ] Fly CLI 설치 및 로그인
- [ ] `fly.toml` 파일 확인
- [ ] `Dockerfile` 파일 확인
- [ ] `rules.yaml` 파일 존재 확인

### 프론트엔드
- [ ] GitHub 계정 생성
- [ ] 저장소 생성 (Public)
- [ ] `package.json`에 `homepage` 추가
- [ ] `config.ts`에서 API URL 설정 확인
- [ ] GitHub Pages 설정 완료

### 배포 후
- [ ] 백엔드 헬스 체크: `https://[APP].fly.dev/health`
- [ ] 백엔드 API 문서: `https://[APP].fly.dev/docs`
- [ ] 프론트엔드 접속: `https://[USER].github.io/[REPO]`
- [ ] 프론트엔드에서 백엔드 API 호출 테스트

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 서울 청년 정책 추천 서비스를 사용할 수 있습니다.

**배포된 서비스 URL:**
- 백엔드: `https://seoul-youth-policies-api.fly.dev`
- 프론트엔드: `https://[YOUR-USERNAME].github.io/seoul-youth-policies`
