import { RequestHandler } from "express";
import { verifyToken } from "@clerk/backend";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY must be set");
}

/**
 * Middleware to verify Clerk JWT token from Authorization header
 * Sets req.user with { id: userId } for compatibility with existing code
 */
export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the Clerk session token
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Set user in request with compatible structure
    // Clerk payload has 'sub' as the user ID
    req.user = {
      id: payload.sub,
      claims: {
        sub: payload.sub,
        email: payload.email || '',
      }
    };

    next();
  } catch (error: any) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
