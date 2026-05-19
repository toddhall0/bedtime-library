import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Phase 0: no seed data yet. Future phases will populate sample
  // narrators, story templates, etc. here.
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
