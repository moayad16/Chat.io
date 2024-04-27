import { getPreSignedUrl } from "@/lib/db/s3Server";

type Props = {
  fileKey: string;
};

export default async function PdfViewer({ fileKey }: Props) {
  
  const presignerUrl = await getPreSignedUrl(fileKey)
  const encodedUrl = encodeURIComponent(presignerUrl);  
  

  return (
    <div className="bg-white w-full rounded-xl">
      <iframe
        src={`https://docs.google.com/gview?url=${encodedUrl}&embedded=true`}
        className="w-full h-full rounded-xl"
      ></iframe>
    </div>
  );
}
