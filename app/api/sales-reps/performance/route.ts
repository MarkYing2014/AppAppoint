import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const salesReps = await prisma.salesRep.findMany({
      select: {
        id: true,
        name: true,
        events: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const performanceData = salesReps.map(rep => {
      const totalEvents = rep.events.length;
      const completedEvents = rep.events.filter(event => event.status === 'completed').length;
      const cancelledEvents = rep.events.filter(event => event.status === 'cancelled').length;
      const scheduledEvents = rep.events.filter(event => event.status === 'scheduled').length;
      
      return {
        id: rep.id,
        name: rep.name,
        totalEvents,
        completedEvents,
        cancelledEvents,
        scheduledEvents,
        completionRate: totalEvents > 0 ? completedEvents / totalEvents : 0,
      };
    });

    console.log('Sales rep performance data:', performanceData);
    return NextResponse.json(performanceData);
  } catch (error: any) {
    console.error('Error fetching sales rep performance:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'Failed to fetch sales rep performance', details: error.message },
      { status: 500 }
    );
  }
}
