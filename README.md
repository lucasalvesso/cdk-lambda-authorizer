# Lambda authorizer with custom responses

### Api gateway has 2 resource paths:
#### . Post - to get a token
#### . Get - to invoke a lambda with Authorization token provided in headers


-----
### Authorizer handler should be able to return policy statemant to allow or deny the request

-----

The keyPair mock was provided from https://mkjwk.org/ in order to generate tokens that will be validated.

This use case should fit the cognito public keys.

OBS: Local execution will get a generic class of secrets manager.