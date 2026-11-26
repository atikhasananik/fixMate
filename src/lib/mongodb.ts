import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

/**
 * Serverless-safe client options.
 *
 * Vercel runs many isolated function instances and each one owns its own
 * client. The driver's default pool (100 connections) multiplied across those
 * instances can exhaust a shared Atlas cluster, so some cold starts fail to
 * connect. The driver then closes that client's topology permanently and every
 * later request served by the instance fails with "Topology is closed".
 *
 * One pooled connection per instance is enough because the client is reused
 * across requests, and the timeouts bound how long a cold start can hang.
 */
const CLIENT_OPTIONS = {
  maxPoolSize: 1,
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
} as const;

type MongoCache = { promise?: Promise<MongoClient> };

const globalForMongo = globalThis as unknown as { __fixmateMongo?: MongoCache };
const cache: MongoCache = (globalForMongo.__fixmateMongo ??= {});

/**
 * Returns a connected client shared by every module in this process.
 *
 * A rejected connection promise is never cached: the driver cannot reuse a
 * client whose topology has closed, so the next call builds a fresh one.
 */
export function getMongoClient(): Promise<MongoClient> {
  if (!cache.promise) {
    const client = new MongoClient(uri, CLIENT_OPTIONS);

    // `next build` imports route modules to collect page data. Don't open a
    // database connection from a build worker; the client connects lazily on
    // first use in the actual server runtime.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return Promise.resolve(client);
    }

    cache.promise = client.connect().catch((error) => {
      cache.promise = undefined;
      throw error;
    });
  }

  return cache.promise;
}
