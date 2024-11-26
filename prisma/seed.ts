import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create territories
  const northTerritory = await prisma.territory.create({
    data: {
      name: 'North Region',
      description: 'Covers all northern states',
    },   ▲ Next.js 14.1.3
       - Local:        http://localhost:3002
       - Environments: .env.local, .env
    
     ✓ Ready in 3s
    
  });

  const southTerritory = await prisma.territory.create({
    data: {
      name: 'South Region',
      description: 'Covers all southern states',
    },
  });

  // Create sales representatives
  await prisma.salesRep.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      territory: {
        connect: {
          id: northTerritory.id
        }
      },
      availability: 'available',
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      notifyEmail: true,
      notifySms: false,
      notifyApp: true,
    },
  });

  await prisma.salesRep.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 234-5678',
      territory: {
        connect: {
          id: southTerritory.id
        }
      },
      availability: 'available',
      workingHoursStart: '08:00',
      workingHoursEnd: '16:00',
      notifyEmail: true,
      notifySms: true,
      notifyApp: true,
    },
  });

  await prisma.salesRep.create({
    data: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 345-6789',
      availability: 'available',
      workingHoursStart: '10:00',
      workingHoursEnd: '18:00',
      notifyEmail: true,
      notifySms: false,
      notifyApp: true,
    },
  });

  // Create some clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '(555) 987-6543',
      notes: 'Large enterprise client',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'TechStart Inc',
      email: 'info@techstart.com',
      phone: '(555) 876-5432',
      notes: 'Growing startup',
    },
  });

  // Create some events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Get all sales reps for reference
  const allSalesReps = await prisma.salesRep.findMany();
  
  // Create multiple events spread across the week
  await prisma.event.create({
    data: {
      title: 'Initial Consultation',
      date: today,
      startTime: '10:00',
      endTime: '11:00',
      notes: 'Discuss new project requirements',
      status: 'scheduled',
      clientId: client1.id,
      salesRepId: allSalesReps[0].id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Follow-up Meeting',
      date: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      notes: 'Review proposal',
      status: 'scheduled',
      clientId: client2.id,
      salesRepId: allSalesReps[1].id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Project Planning',
      date: dayAfterTomorrow,
      startTime: '09:00',
      endTime: '10:30',
      notes: 'Detailed project planning session',
      status: 'scheduled',
      clientId: client1.id,
      salesRepId: allSalesReps[0].id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Technical Discussion',
      date: today,
      startTime: '15:00',
      endTime: '16:00',
      notes: 'Technical requirements review',
      status: 'scheduled',
      clientId: client2.id,
      salesRepId: allSalesReps[2].id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
