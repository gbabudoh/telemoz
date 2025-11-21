import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Password hashing function (same as in lib/auth.ts)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// User Schema (simplified - matches models/User.ts)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["pro", "client", "admin"], required: true, default: "client" },
  image: String,
  emailVerified: Date,
  country: String,
  city: String,
  timezone: { type: String, default: "Europe/London" },
  stripeCustomerId: String,
  subscriptionTier: { type: String, enum: ["starter", "standard", "pro"], default: "starter" },
  subscriptionStatus: { type: String, enum: ["active", "canceled", "past_due"], default: "active" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in environment variables!");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "adminuser1@telemoz.com" });
    if (existingAdmin) {
      console.log("\n⚠️  Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("UserType:", existingAdmin.userType);
      console.log("Name:", existingAdmin.name);
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = hashPassword("g1vemeacess");
    const adminUser = new User({
      email: "adminuser1@telemoz.com",
      name: "Admin User 1",
      password: hashedPassword,
      userType: "admin",
      subscriptionTier: "pro",
      subscriptionStatus: "active",
      timezone: "Europe/London",
    });

    await adminUser.save();
    console.log("\n✅ Admin user created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email:    adminuser1@telemoz.com");
    console.log("Password: g1vemeacess");
    console.log("UserType: admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ You can now login at http://localhost:3000/login");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message);
    if (error.code === 11000) {
      console.log("\n⚠️  User with this email already exists!");
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
createAdmin();

