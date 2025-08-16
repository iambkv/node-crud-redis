const { createClient } = require("redis");
const { redisPassword } = require("../Utils/constants");

const redisClient = createClient({
  username: "default",
  password: redisPassword,
  socket: {
    host: "redis-13147.c326.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 13147,
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("🔌 Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis connected successfully!");
});

redisClient.connect();
module.exports = redisClient;
