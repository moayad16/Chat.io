// import { OpenAIApi, Configuration } from "openai-edge";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function getEmbeddings(text: string) {
//     try {
//         const response = await openai.createEmbedding({
//             model: "text-embedding-ada-002",
//             input: text.replace(/\n/g, " ")
//         });
//         const data = await response.json();
//         console.log("data from embeddings", data);

//         return data.data[0].embedding as number[];

//     } catch (error) {
//         console.log(error);
//         throw new Error("Error getting embeddings")
//     }
// }

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
  modelName: "embedding-001",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Embedding",
});



export async function getEmbeddings(text: string) {    
    
  try {
    const embedding = await embeddings.embedQuery(text);
    console.log(embedding);

    return embedding;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting embeddings");
  }
}
