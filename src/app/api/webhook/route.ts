import { db } from "@/lib/db";
import { userSubs } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SIGNING_SECRET! as string)
    } catch (error) {
        return NextResponse.json({ message: "Webhook Error" }, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    //new user has subscribed
    if(event.type === 'checkout.session.completed'){
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        if(!session.metadata?.userId){
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
    
        await db.insert(userSubs).values({
            userId: session.metadata.userId,
            stripeSubId: sub.id,
            stripeCustomerId: sub.customer as string,
            stripePriceId: sub.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        })
    }

    if(event.type === "invoice.payment_succeeded"){
        const sub = await stripe.subscriptions.retrieve(session.subscription as string)
        await db.update(userSubs).set({
            stripePriceId: sub.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        }).where(eq(userSubs.stripeSubId, sub.id))
    }

    return NextResponse.json(null, { status: 200 })
}