import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createTags(length: number): Promise<number[]> {
  const ids = Array.from({ length }, (_, i) => i + 1)

  const prismaPromises: any = []

  for (const id of ids) {
    prismaPromises.push(
      prisma.tag.create({
        data: {
          id,
        },
      }),
    )
  }

  await prisma.$transaction(prismaPromises)
  return ids
}

async function cleanDb() {
  // clean the database before each test
  const cleanPrismaPromises = [prisma.tag.deleteMany()]
  await prisma.$transaction(cleanPrismaPromises)
}

async function main() {
  await cleanDb()
  const ids = await createTags(1000)

  const tags = await prisma.tag.findMany({
    where: {
      id: { in: ids },
    },
  })

  assert.notEqual(tags.length, 0)
}

main()
  .catch(e => {
    console.log('received error', e)
    process.exit(1)
  }).finally(async () => {
    await prisma.$disconnect()
  })
