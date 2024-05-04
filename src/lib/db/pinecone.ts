import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { getPdfFromS3 } from "./s3Server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "../embeddings";
import md5 from "md5"; 
import { converToAscii } from "../utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

type MyMetadata = {
  text: string;
  pageNumber: number;
};

interface MyRecord extends PineconeRecord<MyMetadata> {
  id: string;
  values: number[];
  metadata: MyMetadata;
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_KEY!,
});

export function getPinecone() {
  return pinecone;
}

async function createEmbeddings(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as MyRecord;
  } catch (error) {
    console.log(error);
    throw new Error("error embedding documents");
  }
}

async function truncateStringByByte(str: string, bytes: number) {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/(\r\n|\n|\r)/gm, " ");
  // split the document
  const splitter = new RecursiveCharacterTextSplitter();
  
  const docs = splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        text: await truncateStringByByte(pageContent, 36000),
        pageNumber: metadata.loc.pageNumber,
      },
    }),
  ]);

  return docs;
}

export async function loads3IntoPinecone(fileKey: string) {
  // get pdf from s3
  console.log("Downloading pdf from s3");
  const fileName = await getPdfFromS3(fileKey);
  if (!fileName) {
    throw new Error("Error downloading pdf from s3");
  }
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];

  // segment the document
  const documents = await Promise.all(pages.map(prepareDocument));

  // vectorize and embedd documents
  const vectors: MyRecord[] = await Promise.all(
    documents.flat().map(createEmbeddings)
  );

  //upload to pinecone
  console.log("Uploading to pinecone");
  const index = pinecone.index("chat-io");
  const namespace = converToAscii(fileKey);
  await index.namespace(namespace).upsert(vectors);
}
