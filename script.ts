import assert from 'node:assert/strict'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function createTags(length: number): Promise<number[]> {
  const ids = Array.from({ length }, (_, i) => i + 1)

  const prismaPromises: any = [
    // Need to clear the database to avoid
    prisma.tag.deleteMany({where: {}})
  ]

  for (const id of ids) {
    prismaPromises.push(
      prisma.tag.create({
        data: {
          id,
          name: 'name-' + id,
          path: 'path-' + id,
        },
      }),
    )
  }

  await prisma.$transaction(prismaPromises)
  return ids
}

async function main() {
  await createTags(5000)
  const randomIds = Array.from({ length: 5000 }, () => Math.floor(Math.random() * 5000))
  const distinctRandomIds = [...new Set(randomIds)]
 
  console.log('randomIds length', randomIds.length) // 5000
  console.log('uniqueRandomIds length', distinctRandomIds.length) // ~3000

  const tagsFromRandomIds = await prisma.tag.findMany({
    where: {
      id: { in: randomIds },
    },
  })

  const tagsFromDistinctRandomIds = await prisma.tag.findMany({
    where: {
      id: { in: distinctRandomIds },
    },
  })

  console.log('tagsFromRandomIds\n', tagsFromRandomIds) // array with ~3000 entries
  console.log('tagsFromDistinctRandomIds\n', tagsFromDistinctRandomIds) // array with ~3000 entries

  assert.equal(distinctRandomIds.length > 2900, true)
  assert.equal(distinctRandomIds.length, tagsFromRandomIds.length)
  assert.equal(tagsFromRandomIds.length, tagsFromDistinctRandomIds.length)
  assert.deepEqual(tagsFromRandomIds, tagsFromDistinctRandomIds)
}

main()
  .catch(e => {
    console.log('received error', e)
    process.exit(1)
  }).finally(async () => {
    await prisma.$disconnect()
  })
