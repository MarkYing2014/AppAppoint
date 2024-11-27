import { NextResponse } from "next/server";
import db from "@/lib/prisma";

export async function GET() {
  console.log('Testing database connection...'); // Debug log

  try {
    // Test basic connection
    await db.$connect();
    console.log('Basic connection successful'); // Debug log

    // Try to query the database
    const result = await db.$queryRaw`SELECT NOW() as server_time`;
    console.log('Query successful:', result); // Debug log

    // Test user table access
    const userCount = await db.user.count();
    console.log('User count:', userCount); // Debug log

    return NextResponse.json({
      status: 'success',
      message: 'Database connection and queries successful',
      details: {
        serverTime: result,
        userCount,
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@') // Hide password
      }
    });
  } catch (error: any) {
    console.error('Database test failed:', {
      message: error.message,
      code: error.code,
      meta: error?.meta
    });

    return NextResponse.json({
      status: 'error',
      message: 'Database connection or query failed',
      error: error.message,
      code: error.code,
      meta: error?.meta
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
