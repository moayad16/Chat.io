import { getPreSignedUrl } from "@/lib/db/s3Server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const fileKey = req.nextUrl.searchParams.get("fileKey");
    const presignedUrl = await getPreSignedUrl(fileKey!);
    // const encodedUrl = encodeURIComponent(presignedUrl);
    
    // console.log(fileKey)
    return NextResponse.json({ encodedUrl: presignedUrl }, { status: 200 });
}