import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OpenAI } from "openai";
import { SSM } from 'aws-sdk';

async function getApiKey(parameterName: string): Promise<string> {
  const ssm = new SSM();
  const apiKeyParam = await ssm.getParameter({
    Name: parameterName,
  }).promise();

  const apiKey = apiKeyParam.Parameter?.Value;
  if (!apiKey) {
    throw new Error('API key is undefined');
  }

  return apiKey;
}

async function createGenAIInstance(): Promise<OpenAI> {
  const apiKey = await getApiKey('/keix/api-key/openai');
  return new OpenAI({ apiKey: apiKey });
}

export const handler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  try {

    const message = "What kind of thailand foods do you like?";
    const openai = await createGenAIInstance();
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-4",
    });

    const text = await chatCompletion.choices[0].message;

    return {
      statusCode: 200,
      body: JSON.stringify({
        project: 'Akatsuki',
        engine: 'GPT-4',
        function: 'TsukiKage',
        text: text,
        version: 'v1',
      }), 
    } 
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: errorMessage,
        error: error instanceof Error ? error.stack : 'Unknown error'
      }),
    };
  }
}
