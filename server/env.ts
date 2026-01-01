import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present at startup
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string (Neon)"),

  // Authentication (Clerk)
  CLERK_SECRET_KEY: z.string().min(1).describe("Clerk secret key for JWT verification"),

  // Payment (Stripe)
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").describe("Stripe secret key"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").describe("Stripe webhook signing secret"),

  // AI (OpenAI)
  OPENAI_API_KEY: z.string().startsWith("sk-").describe("OpenAI API key"),

  // Rate Limiting (Upstash Redis) - Optional in development
  UPSTASH_REDIS_REST_URL: z.string().url().optional().describe("Upstash Redis REST URL for rate limiting"),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().describe("Upstash Redis REST token"),

  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables at startup
 * Throws an error with clear message if any required variable is missing
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);

    // Warn if rate limiting is not configured in production
    if (env.NODE_ENV === "production" && (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN)) {
      console.warn("⚠️  WARNING: Upstash Redis not configured. Rate limiting will be disabled!");
      console.warn("⚠️  This is a security risk in production. Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN");
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment variable validation failed:");
      error.errors.forEach((err) => {
        console.error(`   - ${err.path.join(".")}: ${err.message}`);
      });
      console.error("\nPlease check .env.example for required variables.");
      process.exit(1);
    }
    throw error;
  }
}
