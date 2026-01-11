import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NEXT_PUBLIC_BASE_URL: z.url(),
  PASS_CERTIFICATE_PEM_BASE64: z.string().min(1),
  PASS_KEY_PEM_BASE64: z.string().min(1),
  WWDR_CERTIFICATE_PEM_BASE64: z.string().min(1),
  PASS_KEY_PASSPHRASE: z.string().optional(),
  PASS_TYPE_IDENTIFIER: z.string().min(1),
  TEAM_IDENTIFIER: z.string().length(10),
  ADMIN_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse(process.env);
