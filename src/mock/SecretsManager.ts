import { keyPair } from "./GenerateToken";

class SecretsManagerClient {
  constructor(params: { region?: string }) {}
  send(params?: any) {
    return Promise.resolve({
      //exactly what is returned from secrets manager
      SecretString: JSON.stringify({
        userPoolId: `{keys:[{alg:"RS256",e:"AQAB",kid:"${keyPair.keys[0].kid}",kty:"RSA",n:"${keyPair.keys[0].n}",use:"sig",}]}`,
      }),
    });
  }
}

class GetSecretValueCommand {
  constructor(params: { SecretId?: string }) {}
}

export { GetSecretValueCommand, SecretsManagerClient };
