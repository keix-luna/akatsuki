import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GoogleGenerativeAI } from "@google/generative-ai";
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

async function createGenAIInstance(): Promise<GoogleGenerativeAI> {
  const apiKey = await getApiKey('/keix/api-key/gemini');
  return new GoogleGenerativeAI(apiKey);
}

export const handler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {

    const genAI = await createGenAIInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "The response about the foods in Thailand is limited to 200 words in Japanese.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        model: 'Gemini',
        function: 'SetsuGetsuKa',
        text: text,
        version: 'v1',
      }), 
    };
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
};
