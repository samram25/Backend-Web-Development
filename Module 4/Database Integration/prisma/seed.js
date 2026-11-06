const prisma = require('../src/db/prisma');

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: { name: 'Demo User' },
    create: { id: 1, name: 'Demo User' },
  });

  const posts = [
    {
      id: 1,
      title: 'First post',
      body: 'The contract survives storage changes.',
    },
    {
      id: 2,
      title: 'Second post',
      body: 'Migrations record database design.',
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: { ...post, authorId: user.id },
      create: { ...post, authorId: user.id },
    });
  }

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"User"', 'id'),
      (SELECT COALESCE(MAX(id), 1) FROM "User"),
      true
    )
  `;

  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Post"', 'id'),
      (SELECT COALESCE(MAX(id), 1) FROM "Post"),
      true
    )
  `;

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });