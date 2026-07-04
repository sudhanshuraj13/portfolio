import { PrismaClient } from '@prisma/client';
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", "..", "..", ".env") });

export const prisma = new PrismaClient();

// Optional: cleanup cron utility for 7-day old logs
export const cleanupOldLogs = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  try {
    const deleted = await prisma.systemLog.deleteMany({
      where: {
        timestamp: {
          lt: sevenDaysAgo,
        },
      },
    });
    console.log(`[DB_CRON] Cleaned up ${deleted.count} old system logs.`);
  } catch (error) {
    console.error(`[DB_CRON] Failed to cleanup logs:`, error);
  }
};
