import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    await prisma.$connect();
    console.log("Database connection successful");

    // Try to query the database
    const result = await prisma.$queryRaw`SELECT current_timestamp`;
    console.log("Database query successful:", result);

    // Try to count sales reps
    const salesRepsCount = await prisma.salesRep.count();
    console.log("Current number of sales reps:", salesRepsCount);

    return NextResponse.json({ 
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      salesRepsCount
    });
  } catch (error: any) {
    console.error("Database connection error:", {
      message: error.message,
      code: error.code,
      meta: error?.meta,
      stack: error.stack
    });

    return NextResponse.json({
      status: "error",
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
