import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { AuditoriumService } from 'App/Services'
import AssignShowsDto from 'App/Validators/auditorium/AssignShowsDto'
import CreateAuditoriumDto from 'App/Validators/auditorium/CreateAuditoriumDto'
import UpdateAuditoriumDto from 'App/Validators/auditorium/UpdateAuditoriumDto'

export default class AuditoriumsController {
  constructor(private readonly service = new AuditoriumService()) {}

  /**
   * @index
   * @summary Add a new theater
   * @paramPath theaterId - Id of the Theater
   */
  public async index({ response, request }: HttpContextContract) {
    const { theaterId } = request.qs()
    if (!theaterId) return response.unprocessableEntity({ message: 'Theater ID is required' })
    const auditoriums = await this.service.getListByTheater(theaterId)
    return response.ok(auditoriums)
  }

  public async store({ request, bouncer, response }: HttpContextContract) {
    const payload = await request.validate(CreateAuditoriumDto)
    await bouncer.with('AuditoriumPolicy').authorize('create')
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

  public async assignShows({ response, params, bouncer, request }: HttpContextContract) {
    const payload = await request.validate(AssignShowsDto)
    const auditorium = await this.service.getById(params.id)
    if (!auditorium) return response.notFound({ message: 'Auditorium not found' })
    await bouncer.with('AuditoriumPolicy').authorize('update', auditorium)
    const assign = await this.service.assignShows(auditorium.id, {
      shows: payload.shows.split(',').map((show) => parseInt(show)),
      prices: payload.prices.split(',').map((price) => parseFloat(price)),
      starts: payload.starts,
      ends: payload.ends,
    })
    if (!assign) return response.unprocessableEntity({ message: 'Shows attaching failed!' })
    return response.accepted({ message: 'Shows are attached to the auditorium!' })
  }

  public async getByShow({ response, request }: HttpContextContract) {
    const { theaterId, showId, date } = request.qs()
    if (!theaterId || !showId || !date) {
      return response.unprocessableEntity({
        message: 'Theater, Show & Date is required',
      })
    }
    const auditoriums = await this.service.getAuditoriumsByShow(theaterId, showId, date)
    if (!auditoriums) return response.notFound({ message: 'Auditoriums not found' })
    return response.ok(auditoriums)
  }

  public async getSeats({ response, request }: HttpContextContract) {
    const { showId, auditoriumId, date } = request.qs()
    if (!showId || !auditoriumId || !date) {
      return response.unprocessableEntity({
        message: 'Show, Theater and Date are required',
      })
    }
    const seats = await this.service.getSeats(auditoriumId, showId, date)
    response.ok(seats)
  }

  public async update({ request, response, bouncer, params }: HttpContextContract) {
    const payload = await request.validate(UpdateAuditoriumDto)
    const auditorium = await this.service.getById(params.id)
    if (!auditorium) return response.notFound({ message: 'Auditorium not found' })
    await bouncer.with('AuditoriumPolicy').authorize('update', auditorium)
    const updates = await this.service.update(params.id, payload)
    if (!updates) return response.notFound({ message: "Auditorium couldn't be updated!" })
    return response.accepted({ message: 'Auditorium updated successfully!' })
  }

  public async destroy({ response, bouncer, params }: HttpContextContract) {
    await bouncer.with('AuditoriumPolicy').authorize('delete')
    const remove = await this.service.delete(params.id)
    if (!remove) return response.notFound({ message: "Auditorium couldn't be deleted!" })
    return response.accepted({ message: 'Auditorium deleted successfully!' })
  }
}
