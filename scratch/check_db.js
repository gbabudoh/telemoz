
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
      console.log('User found:');
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('UserType:', user.userType);
      console.log('Has password:', !!user.password);
      // We don't log the password hash for safety, but check if it matches
      const hash = crypto.createHash('sha256').update('g1vemeacess').digest('hex');
      console.log('Password Match:', user.password === hash);
      if (user.password !== hash) {
          console.log('Stored Hash:', user.password);
          console.log('Calculated Hash:', hash);
      }
    } else {
      console.log('User not found.');
      
      // List all users to see what we have
      const allUsers = await prisma.user.findMany({
          take: 5
      });
      console.log('First 5 users in DB:', allUsers.map(u => u.email));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
