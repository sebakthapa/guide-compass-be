type OauthProvider = 'google';

export const oauthFetchPublicKey = (kid: string, provider: OauthProvider) => {
  switch (provider) {
    case 'google':
      return fetchGooglePublicKey(kid);
    default:
      return null;
  }
};

export const fetchGooglePublicKey = async (kid: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  const data = await response.json();
  console.log(data);
  const keys = data.keys;
  console.log(keys);

  const publicKey = keys.find((key: { kid: string }) => key.kid === kid);
  const key = publicKey;

  return constructPublicKey(key.e, key.n);
};

function constructPublicKey(e: string, n: string) {
  if (!e || !n) {
    return null;
  }
  // Construct the key in PEM format
  const modulus = Buffer.from(n, 'base64url');
  const exponent = Buffer.from(e, 'base64url');

  const publicKey = {
    kty: 'RSA',
    n: modulus.toString('base64'),
    e: exponent.toString('base64'),
  };

  const rsaPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${publicKey.n}
-----END PUBLIC KEY-----`;

  return rsaPublicKey;
}
