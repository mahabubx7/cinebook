import { test } from '@japa/runner'
import { TokenService } from 'App/Services'

test.group('Todo', () => {
  // Token: create & read a token
  test('token: should create & read a token', ({ assert }) => {
    const token = TokenService.UID()
    assert.isString(token)
    assert.lengthOf(token, 8) // <-- default 8 characters
  })

  // Token: create & read a token with custom length
  test('token: should create & read a token with custom length', ({ assert }) => {
    const token = TokenService.UID(6)
    assert.isString(token)
    assert.lengthOf(token, 6) // <-- custom 12 characters
  })

  // Token: slugify
  test('token: should slugify a string', ({ assert }) => {
    const slug = TokenService.slugify('Hello World')
    assert.isString(slug)
    assert.include(slug, 'hello-world') // <-- slugged string (toLowerCase)
    assert.isOk(slug.match(/^[a-z0-9\-]+/)) // <-- slugged string (only lowercase)
  })

  // Token: generate a random OTP
  test('token: should generate a random OTP & verify', async ({ assert }) => {
    const otp = await TokenService.generateOtp({ id: 1, email: '<EMAIL>' }) // <-- generate OTP
    assert.isString(otp)
    assert.lengthOf(otp, 6) // <-- 6 digits

    const payload = await TokenService.verifyOtp(otp) // <-- verify OTP
    assert.exists(payload) // <-- payload exists
  })
})
