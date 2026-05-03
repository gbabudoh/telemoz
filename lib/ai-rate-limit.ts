import prisma from "@/lib/prisma";

export const AI_DAILY_CAP = 25;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function checkAndIncrementAiUsage(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiRequestsToday: true, aiLastRequestDate: true },
  });

  if (!user) throw new Error("User not found");

  const today = startOfToday();
  const lastDate = user.aiLastRequestDate ? new Date(user.aiLastRequestDate) : null;
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  const isNewDay = !lastDate || lastDate < today;
  const currentCount = isNewDay ? 0 : user.aiRequestsToday;

  if (currentCount >= AI_DAILY_CAP) {
    return { allowed: false, used: currentCount, limit: AI_DAILY_CAP, remaining: 0 };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiRequestsToday: isNewDay ? 1 : { increment: 1 },
      aiLastRequestDate: new Date(),
    },
  });

  const used = currentCount + 1;
  return { allowed: true, used, limit: AI_DAILY_CAP, remaining: AI_DAILY_CAP - used };
}

export async function getAiUsage(userId: string): Promise<{
  used: number;
  limit: number;
  remaining: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiRequestsToday: true, aiLastRequestDate: true },
  });

  if (!user) return { used: 0, limit: AI_DAILY_CAP, remaining: AI_DAILY_CAP };

  const today = startOfToday();
  const lastDate = user.aiLastRequestDate ? new Date(user.aiLastRequestDate) : null;
  if (lastDate) lastDate.setHours(0, 0, 0, 0);

  const isNewDay = !lastDate || lastDate < today;
  const used = isNewDay ? 0 : user.aiRequestsToday;

  return { used, limit: AI_DAILY_CAP, remaining: AI_DAILY_CAP - used };
}
