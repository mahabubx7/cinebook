import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { AuditoriumService } from 'App/Services'
import AssignShowsDto from 'App/Validators/auditorium/AssignShowsDto'
import CreateAuditoriumDto from 'App/Validators/auditorium/CreateAuditoriumDto'
import UpdateAuditoriumDto from 'App/Validators/auditorium/UpdateAuditoriumDto'

export default class AuditoriumsController {
  constructor(private readonly service = new AuditoriumService()) {}

  public async index({ response, request }: HttpContextContract) {
    const { theaterId } = request.qs()
    if (!theaterId) return response.unprocessableEntity({ message: 'Theater ID is required' })
    const auditoriums = await this.service.getListByTheater(theaterId)
    return response.ok(auditoriums)
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateAuditoriumDto)
    const auditorium = await this.service.create(payload)
    return response.created(auditorium)
  }

  public async show({ response, params }: HttpContextContract) {
    const auditorium = await this.service.getByUid(params.uid)
    if (!auditorium) return response.notFound({ message: 'Auditorium not found' })
    return response.ok(auditorium)
  }

  public async getById({ response, params }: HttpContextContract) {
    const auditorium = await this.service.getById(params.id)
    if (!auditorium) return response.notFound({ message: 'Auditorium not found' })
    return response.ok(auditorium)
  }

  public async assignShows({ response, params, request }: HttpContextContract) {
    const payload = await request.validate(AssignShowsDto)
    const auditorium = await this.service.assignShows(params.id, {
      shows: payload.shows.split(',').map((show) => parseInt(show)),
      prices: payload.prices.split(',').map((price) => parseFloat(price)),
      starts: payload.starts,
      ends: payload.ends,
    })
    if (!auditorium) return response.unprocessableEntity({ message: 'Shows attaching failed!' })
    return response.accepted({ message: 'Shows are attached to the auditorium!' })
  }

  public async getByShow({ response, request }: HttpContextContract) {
    const { theaterId, showId } = request.qs()
    if (!theaterId || !showId) {
      return response.unprocessableEntity({
        message: 'Theater and Show both IDs are required',
      })
    }
    const auditoriums = await this.service.getAuditoriumsByShow(theaterId, showId)
    if (!auditoriums) return response.notFound({ message: 'Auditoriums not found' })
    return response.ok(auditoriums)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(UpdateAuditoriumDto)
    const auditorium = await this.service.update(params.id, payload)
    if (!auditorium) return response.notFound({ message: "Auditorium couldn't be updated!" })
    return response.accepted({ message: 'Auditorium updated successfully!' })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const auditorium = await this.service.delete(params.id)
    if (!auditorium) return response.notFound({ message: "Auditorium couldn't be deleted!" })
    return response.accepted({ message: 'Auditorium deleted successfully!' })
  }
}
