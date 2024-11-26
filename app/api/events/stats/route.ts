import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [total, scheduled, completed, cancelled] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({
        where: { status: 'scheduled' }
      }),
      prisma.event.count({
        where: { status: 'completed' }
      }),
      prisma.event.count({
        where: { status: 'cancelled' }
      })
    ]);

    console.log('Event stats:', { total, scheduled, completed, cancelled });
    return NextResponse.json({
      total,
      scheduled,
      completed,
      cancelled
    });
  } catch (error: any) {
    console.error('Error fetching event stats:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'Failed to fetch event statistics', details: error.message },
      { status: 500 }
    );
  }
}
