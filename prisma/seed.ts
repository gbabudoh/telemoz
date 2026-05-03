import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const url = (process.env.DATABASE_URL || "").replace(/\?schema=\w+/, "");
const pool = new pg.Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hash = await bcrypt.hash("password101", 12);

  const pro = await prisma.user.upsert({
    where: { email: "professional@demo.com" },
    update: {},
    create: {
      name: "Demo Professional",
      email: "professional@demo.com",
      password: hash,
      userType: "pro",
      subscriptionTier: "starter",
      subscriptionStatus: "active",
      timezone: "Europe/London",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: {
      name: "Demo Client",
      email: "client@demo.com",
      password: hash,
      userType: "client",
      subscriptionTier: "starter",
      subscriptionStatus: "active",
      timezone: "Europe/London",
    },
  });

  console.log("Seeded demo accounts:");
  console.log(`  Pro:    ${pro.email} (${pro.userType})`);
  console.log(`  Client: ${client.email} (${client.userType})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
