import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // Try to connect to the database
    await prisma.$connect()
    console.log('✅ Successfully connected to MongoDB!')

    // Try to create a test document
    const testExploit = await prisma.exploit.create({
      data: {
        title: 'Test Exploit',
        description: 'This is a test exploit to verify database connection',
        date: new Date(),
        amountLost: 0,
        type: 'Test',
        status: 'Test',
        project: 'Test Project',
        analysis: 'Test Analysis',
        lessons: 'Test Lessons',
        tags: ['test']
      }
    })
    console.log('✅ Successfully created test document:', testExploit)

    // Try to read the test document
    const readExploit = await prisma.exploit.findUnique({
      where: { id: testExploit.id }
    })
    console.log('✅ Successfully read test document:', readExploit)

    // Clean up - delete the test document
    await prisma.exploit.delete({
      where: { id: testExploit.id }
    })
    console.log('✅ Successfully cleaned up test document')

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 