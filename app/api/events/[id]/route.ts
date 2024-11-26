import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const TIMEOUT_MS = 10000;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const data = await request.json();
    console.log('Updating event:', params.id, 'with data:', data);
    
    // Validate required fields
    if (!data.title || !data.date || !data.startTime || !data.endTime || !data.clientId || !data.salesRepId) {
      return NextResponse.json(
        { error: 'Title, date, start time, end time, client, and sales rep are required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Create a date object at noon UTC to avoid timezone issues
    const dateStr = data.date;
    const [year, month, day] = dateStr.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: data.title,
        date: utcDate,
        startTime: data.startTime,
        endTime: data.endTime,
        clientId: data.clientId,
        salesRepId: data.salesRepId,
        notes: data.notes ?? '',
        status: data.status ?? 'scheduled',
      },
      include: {
        client: true,
        salesRep: {
          include: {
            territory: true
          }
        }
      },
    });

    console.log('Successfully updated event:', updatedEvent);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update event' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await Promise.race([
      prisma.appointment.delete({
        where: { id: params.id },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
