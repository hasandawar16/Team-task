const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasourceUrl: 'mongodb+srv://hasandawar16:Dawar%409101@cluster0.fu7vhiy.mongodb.net/teamtasks?retryWrites=true&w=majority&appName=Cluster0' });
async function test() {
  try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Successfully connected!');
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
test();
