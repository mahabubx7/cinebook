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

  public async getShows({ response, request }: HttpContextContract) {
    const { movieId, theaterId } = request.qs()
    if (!movieId || !theaterId) {
      return response.unprocessableEntity({ message: 'Movie & Theater IDs are required' })
    }
    const shows = await this.service.getListByMovieAndTheater(movieId, theaterId)
    response.ok(shows)
  }

  public async getShowDetails({ response, params }: HttpContextContract) {
    const { id } = params
    if (!id) return response.unprocessableEntity({ message: 'Show ID is required' })
    const showDetails = await this.service.getShowsWithAuditoriums(id)
    if (!showDetails) return response.notFound({ message: 'Show not found' })
    return response.ok(showDetails)
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

  public async create({ request, bouncer, response }: HttpContextContract) {
    const payload = await request.validate(CreateScreenDto)
    await bouncer.with('ScreeningPolicy').authorize('create')
    const screening = await this.service.create(payload)
    return response.created(screening)
  }

  public async update({ request, bouncer, response, params }: HttpContextContract) {
    const payload = await request.validate(UpdateScreenDto)
    const screen = await this.service.getById(params.id)
    if (!screen) return response.notFound({ message: "Screening couldn't be found!" })
    await bouncer.with('ScreeningPolicy').authorize('update', screen)
    const updates = await this.service.update(params.id, payload)
    if (!updates) return response.badRequest({ message: "Screening couldn't be updated!" })
    return response.accepted({ message: 'Screening updated successfully!' })
  }

  public async destroy({ response, bouncer, params }: HttpContextContract) {
    const screen = await this.service.getById(params.id)
    if (!screen) return response.notFound({ message: "Screening couldn't be found!" })
    await bouncer.with('ScreeningPolicy').authorize('delete', screen)
    const screening = await this.service.delete(params.id)
    if (!screening) return response.badRequest({ message: "Screening couldn't be deleted!" })
    return response.accepted({ message: 'Screening deleted successfully!' })
  }
}
