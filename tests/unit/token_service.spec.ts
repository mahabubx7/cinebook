import { test } from '@japa/runner'
import { TokenService } from 'App/Services'

test.group('Todo', () => {
  // Token: create & read a token
  test('token: should create & read a token', async ({ assert }) => {
    const token = TokenService.UID()

    // checks
    assert.isString(token)
  })
})
