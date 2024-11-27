import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const salesReps = await prisma.salesRep.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        territory: true,
      },
    });
    
    // Log the sales reps for debugging
    console.log('API - Fetched sales reps:', JSON.stringify(salesReps, null, 2));
    
    if (salesReps.length === 0) {
      console.log('API - No sales reps found in the database');
    } else {
      console.log(`API - Found ${salesReps.length} sales reps`);
    }
    
    return NextResponse.json(salesReps);
  } catch (error: any) {
    console.error('Error fetching sales reps:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to fetch sales representatives', details: error.message },
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

    const salesRep = await prisma.salesRep.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        availability: data.availability || 'available',
        workingHoursStart: data.workingHoursStart || '09:00',
        workingHoursEnd: data.workingHoursEnd || '17:00',
        notifyEmail: data.notifyEmail ?? true,
        notifySms: data.notifySms ?? false,
        notifyApp: data.notifyApp ?? true,
        territory: data.territoryId ? {
          connect: {
            id: data.territoryId
          }
        } : undefined,
      },
      include: {
        territory: true,
      },
    });
    
    console.log('API - Created sales rep:', JSON.stringify(salesRep, null, 2));
    
    return NextResponse.json(salesRep);
  } catch (error: any) {
    console.error('Error creating sales rep:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to create sales representative', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Sales representative ID is required' },
        { status: 400 }
      );
    }

    const salesRep = await prisma.salesRep.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        availability: data.availability,
        workingHoursStart: data.workingHoursStart,
        workingHoursEnd: data.workingHoursEnd,
        notifyEmail: data.notifyEmail,
        notifySms: data.notifySms,
        notifyApp: data.notifyApp,
        territory: data.territoryId ? {
          connect: {
            id: data.territoryId
          }
        } : undefined,
      },
      include: {
        territory: true,
      },
    });
    
    console.log('API - Updated sales rep:', JSON.stringify(salesRep, null, 2));
    
    return NextResponse.json(salesRep);
  } catch (error: any) {
    console.error('Error updating sales rep:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to update sales representative', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Sales representative ID is required' },
        { status: 400 }
      );
    }

    await prisma.salesRep.delete({
      where: { id },
    });

    console.log(`API - Deleted sales rep with ID ${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sales rep:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: 'Failed to delete sales representative', details: error.message },
      { status: 500 }
    );
  }
}