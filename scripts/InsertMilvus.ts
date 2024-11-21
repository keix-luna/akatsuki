import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import OpenAI from 'openai';
import { auto } from 'openai/_shims/registry.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const milvusClient = new MilvusClient({
  address: '127.0.0.1:19530',
});

const COLLECTION_NAME = 'text_embeddings';
const EMBEDDING_DIM = 1536;

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  try {
    await milvusClient.useDatabase({
      db_name: "ninth_tokyo",
    });

    const hasCollection = await milvusClient.hasCollection({
      collection_name: COLLECTION_NAME,
    });

    console.log("Creating index...");
    await milvusClient.createIndex({
      collection_name: COLLECTION_NAME,
      field_name: 'vector',
      extra_params: {
        index_type: 'IVF_FLAT',
        metric_type: 'COSINE',
        params: JSON.stringify({ nlist: 128 })
      }
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log("Loading collection...");
    await milvusClient.loadCollection({
      collection_name: COLLECTION_NAME,
      replica_number: 1
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = "この設定を有効にすると、挿入されるデータのid 、vector を除くすべてのフィールドがダイナミック・フィールドとして扱われる。これらの追加フィールドは、$meta という特別なフィールド内にキーと値のペアとして保存される。この機能により、データ挿入時に追加フィールドを含めることができる";
    const embedding = await getEmbedding(text);

    console.log("Inserting data...");
    const insertData = {
      text: text,
      vector: embedding
    };

    const insertResponse = await milvusClient.insert({
      collection_name: COLLECTION_NAME,
      fields_data: [insertData]
    });
    console.log("Insert response:", JSON.stringify(insertResponse, null, 2));

    console.log("Flushing data...");
    await milvusClient.flush({
      collection_names: [COLLECTION_NAME],
    });

  } catch (error) {
    console.error("Error in main process:", error);
  } finally {
    await milvusClient.releaseCollection({
      collection_name: COLLECTION_NAME,
    });
    await milvusClient.closeConnection();
  }
}

main();
