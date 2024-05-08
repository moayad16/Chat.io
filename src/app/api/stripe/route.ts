import { db } from "@/lib/db";
import { userSubs } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + "/";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userSub = await db
      .select()
      .from(userSubs)
      .where(eq(userSubs.userId, userId));
    if (userSub[0] && userSub[0].stripeCustomerId) {
      //trying to cancle the subscription
      const stripSession = await stripe.billingPortal.sessions.create({
        customer: userSub[0].stripeCustomerId,
        return_url,
      });

      return NextResponse.json({ url: stripSession.url });
    }

    //trying to subscribe for the first time
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Chat.io Pro",
              description: "Unlimited PDF sessions",
            },
            unit_amount: 1000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
