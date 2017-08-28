import 'es6-promise/auto'
import { create } from 'axios'
import RSA from 'node-rsa'

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

          const { encryptionKey, timeStamp } = response.data

          // https://www.npmjs.com/package/node-rsa#usage
          const header = '-----BEGIN PUBLIC KEY-----'
          const footer = '-----END PUBLIC KEY-----'
          // const decodedKey = Buffer.from(encryptionKey, 'base64')
          const keyData = `${header}${encryptionKey}${footer}`
          const key = new RSA(keyData, 'pkcs8-public-pem')
          const encryptedPassword = key.encrypt(`${password}|${timeStamp}`, 'base64')
          
          loginData.password = encryptedPassword
          
          console.log('keyData:', keyData)
          console.log('encryptedPassword:', encryptedPassword)

          return this.request('post', 'session', 2, loginData)
        })

    } else {
      return this.request('post', 'session', 2, loginData)
    }
  }
}
