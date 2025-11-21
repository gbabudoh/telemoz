const mongoose = require("mongoose");
const crypto = require("crypto");

// Password hashing function (same as in lib/auth.ts)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// User Schema (simplified)
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
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/telemoz";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "adminuser1@telemoz.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("UserType:", existingAdmin.userType);
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
    console.log("✅ Admin user created successfully!");
    console.log("Email: adminuser1@telemoz.com");
    console.log("Password: g1vemeacess");
    console.log("UserType: admin");
    console.log("\nYou can now login with these credentials.");

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  } catch (error) {
    console.error("Error creating admin user:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
createAdmin();

