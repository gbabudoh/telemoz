import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import crypto from "crypto";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Password hashing function (same as in lib/auth.ts)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function createAdmin() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL not found in environment variables!");
    process.exit(1);
  }

  // Strip Prisma-specific query params that pg driver doesn't understand
  const cleanUrl = url.replace(/\?schema=\w+/, "");
  
  const pool = new pg.Pool({ connectionString: cleanUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting to PostgreSQL...");
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "adminuser1@telemoz.com" },
    });

    if (existingAdmin) {
      console.log("\n⚠️  Admin user already exists in PostgreSQL!");
      console.log("Email:", existingAdmin.email);
      console.log("UserType:", existingAdmin.userType);
      
      // Update password just in case
      const hashedPassword = hashPassword("g1vemeacess");
      await prisma.user.update({
          where: { email: "adminuser1@telemoz.com" },
          data: { password: hashedPassword }
      });
      console.log("✅ Password updated for existing account.");
    } else {
      // Create admin user
      const hashedPassword = hashPassword("g1vemeacess");
      await prisma.user.create({
        data: {
          email: "adminuser1@telemoz.com",
          name: "Admin User 1",
          password: hashedPassword,
          userType: "admin",
          subscriptionTier: "pro",
          subscriptionStatus: "active",
          timezone: "Europe/London",
        },
      });

      console.log("\n✅ Admin user created successfully in PostgreSQL!");
      console.log("\n📋 Login Credentials:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Email:    adminuser1@telemoz.com");
      console.log("Password: g1vemeacess");
      console.log("UserType: admin");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    console.log("\n✨ You can now login at http://localhost:3000/login");

  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Run the script
createAdmin();


