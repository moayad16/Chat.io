import { db } from "@/lib/db";
import { userSubs } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const {userId} = await auth();
        const user = await currentUser()

        if(!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const userSub = await db.select().from(userSubs).where(eq(userSubs.userId, userId))
        if(userSub[0] && userSub[0].stripeCustomerId){}

    } catch (error) {
        
    }
}