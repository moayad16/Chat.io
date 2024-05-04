import { pinecone } from "./db/pinecone";
import { getEmbeddings } from "./embeddings";
import { converToAscii } from "./utils";

export async function getMatches(embeddings: number[], fileKey: string) {
    const index = await pinecone.index("chat-io");
    try {
        const namespace = converToAscii(fileKey);
        const queryRes = await index.namespace(namespace).query({
            vector: embeddings,
            topK: 5,
            includeMetadata: true,
        });

        return queryRes.matches || [];
        
    } catch (error) {
        console.log("error quering embeddings ", error);
        throw error;
        
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatches(queryEmbeddings, fileKey);

    const qualifyingDocs = matches.filter((match) => match.score && match.score > 0.7)

    let docs = qualifyingDocs.map((doc) => doc.metadata?.text)

    return docs.join("\n").substring(0, 3000);
}