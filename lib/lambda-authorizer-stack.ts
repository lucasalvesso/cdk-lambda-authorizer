import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "path";
import {
  AuthorizationType,
  Cors,
  IdentitySource,
  LambdaIntegration,
  RequestAuthorizer,
  ResponseType,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

export class LambdaAuthorizerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGateway = new RestApi(this, "ApiGateway", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      deploy: true,
    });

    apiGateway.addGatewayResponse("gatewayResponse", {
      statusCode: "403",
      type: ResponseType.ACCESS_DENIED,
      templates: {
        "application/json": `{"message":$context.authorizer.error}`,
      },
    });

    const authorizerLambda = new NodejsFunction(this, "AuthorizerLambda", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/handlers/Authorizer.ts"),
      handler: "handler",
      timeout: Duration.seconds(3),
    });

    const policies = new PolicyStatement({
      actions: ["cognito-idp:*", "lambda:*", "secretsmanager:*"],
      resources: ["*"],
    });

    authorizerLambda.role?.attachInlinePolicy(
      new Policy(this, "authorizerLambdaPolicies", {
        statements: [policies],
      }),
    );

    const customAuthorizer = new RequestAuthorizer(this, "CustomAuthorizer", {
      handler: authorizerLambda,
      identitySources: [IdentitySource.header("Authorization")],
      resultsCacheTtl: Duration.minutes(1),
    });

    const functionLambda = new NodejsFunction(this, "FunctionLambda", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/handlers/Function.ts"),
      handler: "handler",
      timeout: Duration.seconds(3),
    });

    const resource = apiGateway.root;

    resource.addMethod("get", new LambdaIntegration(functionLambda), {
      authorizer: customAuthorizer,
      authorizationType: AuthorizationType.CUSTOM,
    });

    const getAuthLambda = new NodejsFunction(this, "GetAuthLambda", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "../src/handlers/GetAuth.ts"),
      handler: "handler",
      timeout: Duration.seconds(3),
    });

    resource.addMethod("post", new LambdaIntegration(getAuthLambda));
  }
}
