type Props = {
  url: string;
};

export default function PdfViewer({ url }: Props) {
  return (
    <div className="bg-white w-full rounded-xl">
      <object
        style={{ backgroundColor: "white", borderRadius: "12px" }}
        data={url}
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <embed src={url} type="application/pdf" />
      </object>
    </div>
  );
}
