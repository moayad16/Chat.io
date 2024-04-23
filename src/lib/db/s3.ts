import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

const s3 = new AWS.S3({
  params: {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export async function uploadPdf(
  file: File
): Promise<{ fileName: string; fileKey: string }> {
  const fileKey = `uploads/${Date.now().toString()}${file.name.replace(" ", "-")}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: file,
  };

  const upload = s3
    .putObject(params)
    .on("httpUploadProgress", (progress) => {
      console.log(progress);
    })
    .promise();

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
