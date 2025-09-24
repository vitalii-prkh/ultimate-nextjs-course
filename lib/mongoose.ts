import mongoose, {Mongoose} from "mongoose";
import {log} from "@/lib/log";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    log.info("Using existing mongoose connection");

    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
      })
      .then((result) => {
        log.info("Connected to MongoDB");

        return result;
      })
      .catch((error) => {
        log.error("Error connecting to MongoDB", error);

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;
