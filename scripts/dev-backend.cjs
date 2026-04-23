/* eslint-disable no-undef, @typescript-eslint/no-require-imports */
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const backend = path.join(__dirname, "..", "backend");
const envFile = path.join(backend, ".env");

if (fs.existsSync(envFile)) {
  // Spring Boot는 backend/.env를 자동으로 읽지 않으므로 Node에서 로드 후 Gradle 자식 프로세스 env에 주입한다.
  require("dotenv").config({ path: envFile, override: true });
} else {
  console.warn(
    "[dev-backend] backend/.env 없음 — DB·JWT·Supabase 환경 변수를 셸에 먼저 설정하세요.\n",
  );
}

const requiredKeys = [
  "DB_URL",
  "DB_USERNAME",
  "DB_PASSWORD",
  "SUPABASE_JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
];
const missing = requiredKeys.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(
    `[dev-backend] 경고: 다음 env 누락 — ${missing.join(", ")}\n  backend/.env 경로/내용을 확인하세요: ${envFile}\n`,
  );
}

function run() {
  const spawnEnv = { ...process.env };
  if (process.platform === "win32") {
    return spawn("gradlew.bat", ["bootRun"], {
      cwd: backend,
      stdio: "inherit",
      shell: true,
      env: spawnEnv,
    });
  }
  const unix = path.join(backend, "gradlew");
  if (fs.existsSync(unix)) {
    return spawn(unix, ["bootRun"], {
      cwd: backend,
      stdio: "inherit",
      env: spawnEnv,
    });
  }
  return spawn("gradle", ["bootRun"], {
    cwd: backend,
    stdio: "inherit",
    shell: true,
    env: spawnEnv,
  });
}

const child = run();
child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
