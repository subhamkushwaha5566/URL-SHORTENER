const mongoose = require("mongoose");
const fs = require("fs");

async function testConnection() {
  const uri = process.argv[2];
  if (!uri) {
    console.error("Please provide a MongoDB URI as an argument.");
    process.exit(1);
  }

  console.log("Attempting to connect to:", uri.replace(/:([^:@]+)@/, ':***@')); // Hide password in logs

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(error.message);
    if (error.codeName === "AtlasError") {
      console.error("This is an Atlas-specific error. Double check:");
      console.error("1. Username and Password do not contain unescaped special characters.");
      console.error("2. Your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).");
      console.error("3. The database user has read/write permissions for the cluster.");
    }
    process.exit(1);
  }
}

testConnection();
