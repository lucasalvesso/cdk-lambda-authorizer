import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GenerateToken } from "../mock/GenerateToken";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      token: GenerateToken(),
    }),
  };
};
