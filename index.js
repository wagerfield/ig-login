import 'es6-promise/auto'
import { create } from 'axios'
import pidCrypt from 'pidcrypt'
import pidCryptUtil from 'pidcrypt/pidCrypt_util'
import 'pidcrypt/rsa';
import 'pidcrypt/asn1';

export default class IG {

  constructor(apiKey, isDemo) {
    this.api = create({
      baseURL: `https://${isDemo ? 'demo-' : ''}api.ig.com/gateway/deal/`,
      headers: {
        'Accept': 'application/json; charset=UTF-8',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-IG-API-KEY': apiKey
      }
    })
  }

  request(method, url, version = 1, data = null) {
    const headers = { Version: version }
    return this.api.request({
      method, url, data, headers
    })
  }

  login(username, password, encrypt = false) {

    const loginData = {
      encryptedPassword: encrypt,
      identifier: username,
      password: password
    }

    if (encrypt) {

      // https://labs.ig.com/rest-trading-api-reference/service-detail?id=522
      return this.request('get', 'session/encryptionKey')
        .then((response) => {

          // base64 encoded encryptionKey and timeStamp
          const { encryptionKey, timeStamp } = response.data

          const passwordToEncrypt = `${password}|${timeStamp}`

          const rsa = new pidCrypt.RSA()

          // Decode encryptionKey from base64
          const encryptKey = pidCryptUtil.decodeBase64(encryptionKey)

          // ASN1 parsing
          const asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(encryptKey))
          const tree = asn.toHexTree();

          // setting the public key for encryption with retrieved ASN.1 tree
          rsa.setPublicKeyFromASN(tree);

          const encrypted = rsa.encrypt(passwordToEncrypt)

          // Encode encrypted to base64
          const encryptedPassword = pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(encrypted))

          loginData.password = encryptedPassword

          return this.request('post', 'session', 2, loginData)
        })

    } else {
      return this.request('post', 'session', 2, loginData)
    }
  }
}
