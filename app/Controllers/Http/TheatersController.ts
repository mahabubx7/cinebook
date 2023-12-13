import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TheaterService } from 'App/Services'

export default class TheatersController {
  constructor(private readonly service = new TheaterService()) {}

  public async getTheaterInfo({ request }: HttpContextContract) {
    const theaters = await this.service.getById(request.param('id'))
    return theaters
  }
}
