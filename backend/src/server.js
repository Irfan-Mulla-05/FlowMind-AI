import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { app } from "./app.js";

const start = async () => {
  try {
    await connectDb();
  } catch (error) {
    console.error("Failed to connect to MongoDB.");
    console.error("Check MONGODB_URI, Atlas network access, or whether a local Mongo server is running.");
    throw error;
  }

  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
