import { Clerk } from "@clerk/clerk-sdk-node";
import { CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY } from "./env.config.js";

export const clerkClient = new Clerk({ secretKey: CLERK_SECRET_KEY, apiKey: CLERK_PUBLISHABLE_KEY })