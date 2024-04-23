import AWS from "aws-sdk";
import fs from 'fs';

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


export async function getPdfFromS3(fileKey: string) {
    console.log(fileKey);
    
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
  };

  const pdf = await s3.getObject(params).promise();
  const fileName = `/tmp/pdf-${Date.now()}.pdf`
  fs.writeFileSync(fileName, pdf.Body as Buffer)
  return fileName;

}