import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const territories = await prisma.territory.findMany({
      include: {
        salesReps: true,
      },
    });
    return NextResponse.json(territories);
  } catch (error) {
    console.error("Failed to fetch territories:", error);
    return NextResponse.json(
      { error: "Failed to fetch territories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const territory = await prisma.territory.create({
      data: {
        name: json.name,
        description: json.description,
      },
      include: {
        salesReps: true,
      },
    });
    return NextResponse.json(territory);
  } catch (error) {
    console.error("Failed to create territory:", error);
    return NextResponse.json(
      { error: "Failed to create territory" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json();
    const territory = await prisma.territory.update({
      where: { id: json.id },
      data: {
        name: json.name,
        description: json.description,
        salesReps: {
          set: json.salesRepIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        salesReps: true,
      },
    });
    return NextResponse.json(territory);
  } catch (error) {
    console.error("Failed to update territory:", error);
    return NextResponse.json(
      { error: "Failed to update territory" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Territory ID is required" },
        { status: 400 }
      );
    }

    // First, unassign all sales reps from this territory
    await prisma.salesRep.updateMany({
      where: { territoryId: id },
      data: { territoryId: null },
    });

    // Then delete the territory
    const territory = await prisma.territory.delete({
      where: { id },
    });

    return NextResponse.json(territory);
  } catch (error) {
    console.error("Failed to delete territory:", error);
    return NextResponse.json(
      { error: "Failed to delete territory" },
      { status: 500 }
    );
  }
}