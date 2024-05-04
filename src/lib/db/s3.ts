import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET!,
  },
});

export async function uploadPdf(
  file: File
): Promise<{ fileName: string; fileKey: string }> {
  const fileKey = `uploads/${Date.now().toString()}${file.name.replace(
    " ",
    "-"
  )}`;
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: file,
    ContentType: "application/pdf",
    ContentDisposition: "inline",
  };

  const command  = new PutObjectCommand(params);

  console.log("uploading to s3");
  

  const upload = s3Client.send(command);

  await upload.then((data) => {
    console.log("Uploaded pdf to s3 bucket");
  });

  return Promise.resolve({
    fileName: file.name,
    fileKey: fileKey,
  });
}

export function getS3Url(fileKey: string) {
  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
}
