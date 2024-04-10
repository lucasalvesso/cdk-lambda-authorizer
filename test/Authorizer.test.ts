import { Authorizer } from "../src/handlers/Authorizer";
import { GenerateToken } from "../src/mock/GenerateToken";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("Authorization Lambda", () => {
  test("should return allow action", async () => {
    const event = {
      headers: {
        Authorization: GenerateToken(),
      },
    } as unknown as APIGatewayProxyEvent;
    const authorizerLambda = new Authorizer(event);
    const response = await authorizerLambda.generatePolicy();

    expect(response).toStrictEqual({
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          { Action: "execute-api:Invoke", Effect: "Allow", Resource: "*" },
        ],
      },
    });
  });

  test("should return error - invalid signature", async () => {
    const event = {
      headers: {
        Authorization: GenerateToken() + "s",
      },
    } as unknown as APIGatewayProxyEvent;
    const authorizerLambda = new Authorizer(event);
    const response = await authorizerLambda.generatePolicy();

    expect(response).toStrictEqual({
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
      context: {
        error: "Invalid token signature",
      },
    });
  });
});
