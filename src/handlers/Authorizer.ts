import { APIGatewayAuthorizerResult, APIGatewayProxyEvent } from "aws-lambda";
import { verify, decode } from "jsonwebtoken";
import jwkToPem, { JWK } from "jwk-to-pem";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export class Authorizer {
  constructor(private event: APIGatewayProxyEvent) {}

  private async verifyCognitoToken(): Promise<{
    effect: "Allow" | "Deny";
    errorMessage?: ErrorMessage;
  }> {
    try {
      const authorization = this.event.headers.Authorization;
      if (!authorization) {
        return { effect: "Deny", errorMessage: ErrorMessage.INVALID };
      }

      const parsedToken = decode(authorization, { complete: true });

      if (!parsedToken) {
        return { effect: "Deny", errorMessage: ErrorMessage.INVALID };
      }

      const cognitoKidsValues = await this.getCognitoKidsValues();
      const compatibleKid = cognitoKidsValues?.keys?.find(
        (i) => i.kid === parsedToken?.header.kid,
      );

      if (!compatibleKid) {
        return { effect: "Deny", errorMessage: ErrorMessage.INVALID };
      }

      const pem = jwkToPem(compatibleKid as unknown as JWK);
      const result = verify(authorization, pem, {
        algorithms: ["RS256"],
      });

      if (!result) {
        return { effect: "Deny", errorMessage: ErrorMessage.INVALID };
      }

      return { effect: "Allow" };
    } catch (e) {
      console.log("catch", e);

      if ((e as { message?: string })?.message === "jwt expired") {
        return { effect: "Deny", errorMessage: ErrorMessage.EXPIRED };
      }

      if ((e as { message?: string })?.message === "invalid signature") {
        return {
          effect: "Deny",
          errorMessage: ErrorMessage.INVALID,
        };
      }

      return { effect: "Deny", errorMessage: ErrorMessage.INVALID };
    }
  }

  private async getCognitoKidsValues(): Promise<CognitoKidValue | undefined> {
    const secret_name = "CustomLambdaAuthorizerCognitoKids";

    const client = new SecretsManagerClient({
      region: process.env.AWS_REGION,
    });

    try {
      const response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
        }),
      );

      const parsed = JSON.parse(response?.SecretString || "") as Record<
        string,
        string
      >;
      const kid = parsed["userPoolId"];
      return { keys: eval(kid) } as CognitoKidValue;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async generatePolicy(): Promise<APIGatewayAuthorizerResult> {
    const response = await this.verifyCognitoToken();
    const policy: APIGatewayAuthorizerResult = {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: response.effect,
            Resource: "*",
          },
        ],
      },
    };

    if (response.effect === "Deny") {
      policy.context = {
        error: response.errorMessage,
      };
    }

    return policy;
  }
}

type CognitoKidValue = { keys: Array<Record<string, string>> };

enum ErrorMessage {
  INVALID = "Invalid token signature",
  EXPIRED = "Token Expired",
}

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const authorizer = new Authorizer(event);
  return await authorizer.generatePolicy();
};
