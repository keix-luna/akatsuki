import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

let milvusClient: MilvusClient | null = null;

const getMilvusClient = () => {
  if (!milvusClient) {
    milvusClient = new MilvusClient({
      address: '18.176.156.233:19530',
      // address: process.env.MILVUS_ADDRESS,
      // username: process.env.MILVUS_USERNAME,
      // password: process.env.MILVUS_PASSWORD,
    });
  }
  return milvusClient;
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  try {
    const client = getMilvusClient();
    
    // ここにMilvusの操作コードを実装
    // 例: コレクションの一覧を取得
    const collections = await client.listCollections();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        collections,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
