import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { ScreeningService } from 'App/Services'
import CreateScreenDto from 'App/Validators/screening/CreateScreenDto'
import UpdateScreenDto from 'App/Validators/screening/UpdateScreenDto'

export default class ScreeningsController {
  constructor(private readonly service = new ScreeningService()) {}

  public async index({ response, request }: HttpContextContract) {
    const { movieId } = request.qs()
    if (!movieId) return response.unprocessableEntity({ message: 'Movie ID is required' })
    const screenings = await this.service.getListByMovie(movieId)
    return response.ok(screenings)
  }

  public async getByUid({ response, params }: HttpContextContract) {
    const screening = await this.service.getByUid(params.uid)
    if (!screening) return response.notFound({ message: 'Screening not found' })
    return response.ok(screening)
  }

  public async getById({ response, params }: HttpContextContract) {
    const screening = await this.service.getById(params.id)
    if (!screening) return response.notFound({ message: 'Screening not found' })
    return response.ok(screening)
  }

  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateScreenDto)
    const screening = await this.service.create(payload)
    return response.created(screening)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(UpdateScreenDto)
    const screening = await this.service.update(params.id, payload)
    if (!screening) return response.notFound({ message: "Screening couldn't be updated!" })
    return response.accepted({ message: 'Screening updated successfully!' })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const screening = await this.service.delete(params.id)
    if (!screening) return response.notFound({ message: "Screening couldn't be deleted!" })
    return response.accepted({ message: 'Screening deleted successfully!' })
  }
}
