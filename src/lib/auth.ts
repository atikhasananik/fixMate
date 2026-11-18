import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { isGoogleAuthEnabled } from "@/lib/auth-providers";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixMate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // Keep in sync with the client-side rule in `src/lib/validation.ts`.
    minPasswordLength: 6,
  },
  // Optional Google login. New Google users get the `customer` role from the
  // create hook below (any role other than "technician" is stored as customer).
  socialProviders: isGoogleAuthEnabled()
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : undefined,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        // Allows `signUp.email({ role })` from the client.
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        /**
         * Server-side allow-list. The client only offers "customer" and
         * "technician", but any tampered request (e.g. role: "admin") is
         * stored as "customer".
         */
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "technician" ? "technician" : "customer",
          },
        }),
      },
    },
  },
});
