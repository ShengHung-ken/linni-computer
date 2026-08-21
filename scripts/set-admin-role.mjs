import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_USER_ID =
  "1b01bc86-4a57-4f56-8913-6410ac83168a";

if (!SUPABASE_URL) {
  throw new Error(
    "缺少 SUPABASE_URL",
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "缺少 SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const {
  data,
  error,
} =
  await supabase.auth.admin.updateUserById(
    ADMIN_USER_ID,
    {
      app_metadata: {
        role: "admin",
      },
    },
  );

if (error) {
  console.error(
    "設定管理員角色失敗：",
  );

  console.error(
    error.message,
  );

  process.exit(1);
}

console.log(
  "管理員角色設定成功",
);

console.log(
  `Email: ${
    data.user.email ?? "未知"
  }`,
);

console.log(
  `Role: ${
    data.user.app_metadata
      ?.role ?? "未設定"
  }`,
);