
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
    const user = await prisma.user.findUnique({
      where: { email: 'adminuser1@telemoz.com' },
    });

    if (user) {
      console.log('✅ User exists in PostgreSQL');
      const hash = crypto.createHash('sha256').update('g1vemeacess').digest('hex');
      console.log('✅ Password hash match:', user.password === hash);
      console.log('User Type:', user.userType);
    } else {
      console.log('❌ User NOT found in PostgreSQL');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
