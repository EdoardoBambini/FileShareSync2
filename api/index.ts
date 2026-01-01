import express from "express";
import cors from "cors";
import { validateEnv } from "../server/env";
import { registerRoutes } from "../server/routes";

// Validate environment variables on startup
validateEnv();

// Create Express app for Vercel serverless
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-domain.vercel.app'])
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for Vercel
app.set("trust proxy", 1);

// Request logging middleware (simplified for serverless)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Initialize routes
let routesInitialized = false;
const initializeRoutes = async () => {
  if (!routesInitialized) {
    await registerRoutes(app);

    // Error handler
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Error:", err);
      res.status(status).json({ message });
    });

    routesInitialized = true;
  }
};

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  await initializeRoutes();
  return app(req, res);
}
