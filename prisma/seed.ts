import { prisma } from '../src/database/index';

async function main() {
  const users = await prisma.users.createMany({ data: [
    { name: 'test', password: 'test' },
    { name: 'daniel', password: 'danieltest' },
    { name: 'coopers', password: 'coopers' },
  ]});

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })