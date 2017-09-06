## Setup

Install the project dependencies:

```bash
npm install
```

Create a `.env` file at the root of the repository and paste the following:

```
LIVE_API_KEY=liveApiKey
LIVE_USERNAME=liveAccountUsername
LIVE_PASSWORD=liveAccountPassword

DEMO_API_KEY=demoApiKey
DEMO_USERNAME=demoAccountUsername
DEMO_PASSWORD=demoAccountPassword
```

Replace the placeholder credentials with your own.

## Testing

To run the tests once:

```bash
npm run test
```

To run the tests during development:

```bash
npm run test:watch
```

## Problem

When logging into IG via the API, the password can be optionally encrypted for extra security to help prevent "man in the middle" attacks.

To send the password encrypted, an `encryptionKey` and `timeStamp` must first be requested via the `session/encryptionKey` [endpoint](https://labs.ig.com/rest-trading-api-reference/service-detail?id=522).

The returned `encryptionKey` is in `base64` format.

What is unclear to me is how the RSA token should be generated.

This [post](https://labs.ig.com/node/295) discusses the problem, but the solution is still not obvious to me.

So far I have gathered that the `encryptionKey` is to be used to create an RSA token and then the password should be encrypted with the `timeStamp` like so:

```
password + "|" + timeStamp
```

I am attempting to use the popular [`node-rsa`](https://www.npmjs.com/package/node-rsa) package to create the RSA token. However, I would like to know:

1. What [format](https://www.npmjs.com/package/node-rsa#format-string-syntax) should the RSA `key` be in?
    - `pkcs1` or `pkcs8`? Should be `pkcs1`
    - `public` or `private`? Should be `public`
    - `pem` or `der`?
2. Should I wrap the `encryptionKey` in a header and footer?
3. Does the `encryptionKey` need to be decoded from `base64` before it is used? It should be decoded, yes.

The relevant code that configures the RSA key can be [seen here](https://github.com/wagerfield/ig-login/blob/master/index.js#L42-L47).
