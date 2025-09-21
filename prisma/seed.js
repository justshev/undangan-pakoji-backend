import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.guest.createMany({
    data: [
      { name: "Sheva", email: "sheva@example.com", totalInvited: 2 },
      { name: "Rani", email: "rani@example.com", totalInvited: 4 },
    ],
  });
}

main()
  .then(() => console.log("Seeding done ✅"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
