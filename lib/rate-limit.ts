import { prisma } from "@/lib/prisma";

const RETENTION_SECONDS = 7 * 24 * 60 * 60;

export async function consumeUserRateLimit({
  userId,
  action,
  limit,
  windowSeconds,
  quantity = 1
}: {
  userId: string;
  action: string;
  limit: number;
  windowSeconds: number;
  quantity?: number;
}) {
  const now = Date.now();
  const windowStart = new Date(now - windowSeconds * 1000);

  const usage = await prisma.rateLimitEvent.aggregate({
    where: {
      userId,
      action,
      createdAt: {
        gte: windowStart
      }
    },
    _sum: {
      quantity: true
    }
  });

  if ((usage._sum.quantity ?? 0) + quantity > limit) {
    return false;
  }

  await prisma.rateLimitEvent.create({
    data: {
      userId,
      action,
      quantity
    }
  });

  await prisma.rateLimitEvent.deleteMany({
    where: {
      createdAt: {
        lt: new Date(now - RETENTION_SECONDS * 1000)
      }
    }
  });

  return true;
}
