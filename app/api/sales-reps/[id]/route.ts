import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const salesRep = await prisma.salesRep.findUnique({
      where: { id: params.id },
    });
    if (!salesRep) {
      return NextResponse.json({ error: 'Sales rep not found' }, { status: 404 });
    }
    return NextResponse.json(salesRep);
  } catch (error) {
    console.error('Error fetching sales rep:', error);
    return NextResponse.json({ error: 'Failed to fetch sales rep' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const salesRep = await prisma.salesRep.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
    return NextResponse.json(salesRep);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update sales representative" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.salesRep.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Sales representative deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete sales representative" },
      { status: 500 }
    );
  }
}