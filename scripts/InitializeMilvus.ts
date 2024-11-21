import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import OpenAI from 'openai';
import { auto } from 'openai/_shims/registry.mjs';

const milvusClient = new MilvusClient({
  address: '127.0.0.1:19530',
});

// 9th.tokyo
const NINTH_TOKYO_DB = "ninth_tokyo";
const COLLECTION_NAME = 'text_embeddings';
const EMBEDDING_DIM = 1536;

async function main() {
  try {
    await milvusClient.createDatabase({
      db_name: NINTH_TOKYO_DB,
    });

    await milvusClient.useDatabase({
      db_name: NINTH_TOKYO_DB,
    });

    const databases = await milvusClient.listDatabases();
    console.log("Available databases:", databases);

    const hasCollection = await milvusClient.hasCollection({
      collection_name: COLLECTION_NAME,
    });

    if (hasCollection.value) {
      console.log("Dropping existing collection...");
      await milvusClient.dropCollection({
        collection_name: COLLECTION_NAME,
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log("Creating collection...");
    await milvusClient.createCollection({
      collection_name: COLLECTION_NAME,
      dimension: EMBEDDING_DIM,
      enable_dynamic_field: true,
      auto_id: true,
//      fields: [
//        {
//          name: "id",
//          data_type: DataType.Int64,
//          is_primary_key: true,
//        },
//        { 
//          name: "text", 
//          data_type: DataType.VarChar, 
//          max_length: 1024
//        },
//        { 
//          name: "vector", 
//          data_type: DataType.FloatVector, 
//          dim: EMBEDDING_DIM,
//          type_params: {
//            dim: EMBEDDING_DIM.toString()
//          }
//        }
//      ],
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.log(error);
  }
}

main();
