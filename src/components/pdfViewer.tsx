type Props = {
  url: string | undefined;
  state: boolean;
};

export default function PdfViewer({ url, state }: Props) {
  return (
    <div className="bg-sideBar-bg w-full rounded-xl">
      {url ? (
        <object
          style={{ backgroundColor: "white", borderRadius: "12px" }}
          data={url}
          type="application/pdf"
          width="100%"
          height="100%"
        >
          <embed src={url} type="application/pdf" />
        </object>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {state && <p className="text-lg text-gray-400">No file selected</p>}
        </div>
      )}
    </div>
  );
}
