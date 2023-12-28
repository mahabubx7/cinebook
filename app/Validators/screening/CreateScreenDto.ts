import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateScreenDto {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.minLength(5), rules.maxLength(100)]),
    movieId: schema.number(),
    theaterId: schema.number(),
    running: schema.boolean.optional(),
    startTime: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(5),
      rules.regex(/^\d{2}:\d{2}$/),
    ]),
    endTime: schema.string({ trim: true }, [
      rules.minLength(5),
      rules.maxLength(5),
      rules.regex(/^\d{2}:\d{2}$/),
      rules.afterField('startTime'),
    ]),
    bookingStartDate: schema.string.optional({ trim: true }, [
      rules.maxLength(10),
      rules.minLength(10),
      rules.regex(/^\d{4}-\d{2}-\d{2}$/),
    ]),
    screeningOpenAt: schema.string({ trim: true }, [
      rules.maxLength(19),
      rules.minLength(19),
      rules.regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    ]),
    screeningEndAt: schema.string({ trim: true }, [
      rules.maxLength(19),
      rules.minLength(19),
      rules.regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
