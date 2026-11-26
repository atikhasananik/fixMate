import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { isGoogleAuthEnabled } from "@/lib/auth-providers";
import { getMongoClient } from "@/lib/mongodb";
import { jwt } from "better-auth/plugins";

// One connected client per serverless instance, cached in `lib/mongodb.ts`.
// Awaiting it here means a failed cold-start connection fails the instance
// instead of leaving it serving "Topology is closed" for its whole lifetime.
const client = await getMongoClient();
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
        input: true,
      },
      phone: {
        type: "number",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
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
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, //7 days
    },
  },
});
