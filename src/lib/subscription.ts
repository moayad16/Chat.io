import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { userSubs } from "./db/schema";
import { eq } from "drizzle-orm";

export async function checkSub() {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }

  const _userSubs = await db
    .select()
    .from(userSubs)
    .where(eq(userSubs.userId, userId));

  if (!_userSubs[0]) {
    return false;
  }

  const userSub = _userSubs[0];
  

  const isValid =
    userSub.stripePriceId &&
    userSub.stripeCurrentPeriodEnd &&
    userSub.stripeCurrentPeriodEnd.getTime() + 1000 * 60 * 60 * 24 > Date.now();

  return !!isValid;
}
