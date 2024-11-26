-- AlterTable
ALTER TABLE "SalesRep" ALTER COLUMN "territory" DROP NOT NULL,
ALTER COLUMN "workingHoursStart" DROP NOT NULL,
ALTER COLUMN "workingHoursStart" SET DEFAULT '09:00',
ALTER COLUMN "workingHoursEnd" DROP NOT NULL,
ALTER COLUMN "workingHoursEnd" SET DEFAULT '17:00';

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "workingHoursStart" TEXT NOT NULL DEFAULT '09:00',
    "workingHoursEnd" TEXT NOT NULL DEFAULT '17:00',
    "defaultTerritory" TEXT,
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifySms" BOOLEAN NOT NULL DEFAULT false,
    "notifyApp" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);
