import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "../src/mock/SecretsManager";

jest.mock("@aws-sdk/client-secrets-manager", () => {
  return { SecretsManagerClient, GetSecretValueCommand };
});
