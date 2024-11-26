import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const TIMEOUT_MS = 10000;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.date || !data.startTime || !data.endTime || !data.clientId || !data.salesRepId) {
      return NextResponse.json(
        { error: 'Title, date, start time, end time, client, and sales representative are required' },
        { status: 400 }
      );
    }

    const event = await Promise.race([
      prisma.event.create({
        data: {
          title: data.title,
          date: new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          clientId: data.clientId,
          salesRepId: data.salesRepId,
          notes: data.notes || '',
          status: data.status || 'scheduled',
        },
        include: {
          client: true,
          salesRep: {
            include: {
              territory: true,
            },
          },
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    return NextResponse.json(event);
  } catch (error: any) {
    console.error('Error creating event:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'Failed to create event', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await Promise.race([
      prisma.event.findMany({
        include: {
          client: true,
          salesRep: {
            include: {
              territory: true,
            },
          },
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    console.log('Fetched events:', events);
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    );
  }
}
