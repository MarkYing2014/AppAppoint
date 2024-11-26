import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取设置
export async function GET() {
  try {
    // 获取第一条设置记录，如果不存在则创建默认设置
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          workingHoursStart: "09:00",
          workingHoursEnd: "17:00",
          notifyEmail: true,
          notifySms: false,
          notifyApp: true
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// 更新设置
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    
    // 获取第一条设置记录的ID
    let settings = await prisma.systemSettings.findFirst();
    
    if (settings) {
      // 更新现有设置
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          workingHoursStart: data.workingHoursStart,
          workingHoursEnd: data.workingHoursEnd,
          defaultTerritory: data.defaultTerritory,
          notifyEmail: data.notifyEmail,
          notifySms: data.notifySms,
          notifyApp: data.notifyApp
        }
      });
    } else {
      // 创建新设置
      settings = await prisma.systemSettings.create({
        data: {
          workingHoursStart: data.workingHoursStart,
          workingHoursEnd: data.workingHoursEnd,
          defaultTerritory: data.defaultTerritory,
          notifyEmail: data.notifyEmail,
          notifySms: data.notifySms,
          notifyApp: data.notifyApp
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
