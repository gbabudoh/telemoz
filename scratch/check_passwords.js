
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import crypto from 'crypto';

async function main() {
  const url = "postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/telemoz?schema=public";
  const cleanUrl = url.replace(/\?schema=\w+/, "");
  
  const pool = new pg.Pool({ connectionString: cleanUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany();
    users.forEach(u => {
        console.log(`Email: ${u.email}, Password Length: ${u.password ? u.password.length : 'N/A'}`);
        if (u.password && u.password.length === 64) {
            console.log(`  Looks like SHA-256`);
        } else if (u.password && u.password.startsWith('$2')) {
            console.log(`  Looks like Bcrypt`);
        }
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
