import IG from './index'
import getConfig from './env'

const demo = getConfig(true)
const live = getConfig(false)

test('login to live account', async () => {
  expect.assertions(1)
  const ig = new IG(live.apiKey, live.isDemo)
  const response = await ig.login(live.username, live.password)
  expect(response.status).toBe(200)
})

test('login to demo account', async () => {
  expect.assertions(1)
  const ig = new IG(demo.apiKey, demo.isDemo)
  const response = await ig.login(demo.username, demo.password)
  expect(response.status).toBe(200)
})

test('login to live account with encrypted password', async () => {
  expect.assertions(1)
  const ig = new IG(live.apiKey, live.isDemo)
  try {
    const response = await ig.login(demo.username, demo.password, true)
    expect(response.status).toBe(200)
  } catch (error) {
    console.error(error.response 
      ? error.response.data.errorCode
      : error.message)
  }
})
