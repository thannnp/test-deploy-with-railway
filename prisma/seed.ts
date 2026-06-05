import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.task.count();
  if (count > 0) {
    console.log(`Seed skipped: ${count} tasks already exist`);
    return;
  }

  await prisma.task.createMany({
    data: [
      {
        title: 'Setup Railway project',
        description: 'Create Railway project and connect GitHub repo',
        status: 'DONE',
      },
      {
        title: 'Configure PostgreSQL',
        description: 'Add PostgreSQL database and link DATABASE_URL',
        status: 'DONE',
      },
      {
        title: 'Deploy NestJS app',
        description: 'Build Docker image and deploy to Railway',
        status: 'IN_PROGRESS',
      },
      {
        title: 'Add proper migrations',
        description: 'Replace db push with migrate deploy for production',
        status: 'PENDING',
      },
    ],
  });

  console.log('Seed completed: 4 tasks inserted');
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
