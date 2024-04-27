import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET!,
  },
});

export async function getPdfFromS3(fileKey: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
  };

  const command = new GetObjectCommand(params);

  const pdf = await s3Client.send(command)

  const pdfArray = await pdf.Body?.transformToByteArray();

  const fileName = `/tmp/pdf-${Date.now()}.pdf`;
  fs.writeFileSync(fileName, pdfArray as Buffer);
  return fileName;
}

export async function getPreSignedUrl(fileKey: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
  };

  const expiration = 60 * 60 * 24 * 7; // 7 days

  try {
    const preSigned = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: expiration });
    return preSigned;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting pre-signed URL");
  }
}
