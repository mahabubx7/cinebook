import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new CustomException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class CustomException extends Exception {
  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status ?? 400).json({
      ...error,
      message: this.message,
      name: this.name,
      help: this.help,
    })
  }
}
