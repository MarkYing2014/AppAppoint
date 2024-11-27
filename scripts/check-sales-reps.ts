import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check existing sales reps
    const existingSalesReps = await prisma.salesRep.findMany({
      include: {
        territory: true,
        user: true,
      },
    });

    console.log('Existing Sales Representatives:', existingSalesReps);

    if (existingSalesReps.length === 0) {
      console.log('No sales representatives found. Creating sample data...');

      // Create a territory first
      const territory = await prisma.territory.create({
        data: {
          name: 'North Region',
          description: 'Northern sales territory',
        },
      });

      // Create sample sales representatives
      const sampleSalesReps = [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '123-456-7890',
          territoryId: territory.id,
        },
        {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '123-456-7891',
          territoryId: territory.id,
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '123-456-7892',
          territoryId: territory.id,
        },
        {
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          phone: '123-456-7893',
          territoryId: territory.id,
        },
      ];

      for (const rep of sampleSalesReps) {
        await prisma.salesRep.create({
          data: rep,
        });
      }

      console.log('Sample sales representatives created successfully!');
    } else {
      console.log(`Found ${existingSalesReps.length} sales representatives in the database.`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
