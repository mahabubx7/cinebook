/*
|-------------------------------------------------------------
| @TokenService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used for unspecified
| custom domain based services
|
| @Dependencies: Redis (for OTP with persisted information)
|
|*/

import Redis from '@ioc:Adonis/Addons/Redis'

export class TokenService {
  constructor() {}

  /**
   * @TokenService: Generate a random OTP
   * @Params: option OtpOptions
   * @Params: digits <4 | 6 | 8 | 10 | 12> [optional]
   * @returns otp Promise<string>
   */
  public static async generateOtp(
    payload: any,
    expiresIn: number = 120, // 2 mins
    digits: 4 | 6 | 8 | 10 | 12 = 6
  ) {
    let code: number[] = []
    for (let i = 0; i < +digits; i++) {
      code.push(Math.floor(Math.random() * 7))
    }
    const otp: string = code.join('')
    const key = `otp-:${otp}`
    await Redis.set(key, JSON.stringify(payload), 'EX', expiresIn)
    return otp
  }

  /**
   * @TokenService: Verify OTP
   * @Params: otp string
   * @returns payload Promise<any>
   */
  public static async verifyOtp(otp: string) {
    const key = `otp-:${otp}`
    const payload = await Redis.get(key)
    if (!payload) {
      return false
    }
    await Redis.del(key)
    return await JSON.parse(payload)
  }

  /**
   * @TokenService: Make slug from string
   * @param text string
   * @param len number (optional)
   * @returns payload string
   */
  public static slugify(text: string, len: number = 8) {
    const txt = text.toLowerCase().replace(/[^a-z]+/g, '-')
    const uKey = Math.random()
      .toString(36)
      .substring(2, len + 2)
    return `${txt}-${uKey}`
  }

  /**
   * @TokenService: Generate unique id
   * @param len number
   * @returns payload string
   */
  public static UID(len: number = 16) {
    if (len < 4) len = 4 // minimum length fix
    else if (len > 32) len = 32 // maximum length fix
    return Math.random()
      .toString(36)
      .substring(2, len + 2)
  }
}
