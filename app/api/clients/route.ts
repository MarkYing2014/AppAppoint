import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Set timeout for database operations
const TIMEOUT_MS = 10000;

export async function GET() {
  try {
    const clients = await Promise.race([
      prisma.client.findMany({
        include: {
          events: true,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    console.log('Fetched clients:', clients);
    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Error fetching clients:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingClient = await Promise.race([
      prisma.client.findUnique({
        where: { email: data.email },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this email already exists' },
        { status: 409 }
      );
    }

    const client = await Promise.race([
      prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes || '',
        },
        include: {
          events: true,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    console.log('Client created successfully:', client);
    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error creating client:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A client with this email already exists' },
          { status: 409 }
        );
      }
    }

    if (error.message === 'Database operation timed out') {
      return NextResponse.json(
        { error: 'The request took too long to process. Please try again.' },
        { status: 408 }
      );
    }

    return NextResponse.json({ 
      error: 'Failed to create client',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Check if email is taken by another client
    const existingClient = await prisma.client.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: id
        }
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'A client with this email already exists' },
        { status: 409 }
      );
    }

    const client = await Promise.race([
      prisma.client.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes || '',
        },
        include: {
          events: true,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error updating client:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json({ 
      error: 'Failed to update client',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    await Promise.race([
      prisma.client.delete({
        where: { id },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), TIMEOUT_MS)
      ),
    ]);

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', {
      message: error.message,
      code: error.code,
      name: error.name,
    });
    return NextResponse.json({ 
      error: 'Failed to delete client',
      details: error.message
    }, { status: 500 });
  }
}