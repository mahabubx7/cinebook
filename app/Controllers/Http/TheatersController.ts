import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TheaterService } from 'App/Services'
import CreateTheaterDto from 'App/Validators/theater/create-dto'
import UpdateTheaterDto from 'App/Validators/theater/update-dto'

export default class TheatersController {
  constructor(private readonly service = new TheaterService()) {}

  // Create a new Theater
  public async addTheater({ request, auth, bouncer, response }: HttpContextContract) {
    await auth.authenticate()
    await bouncer.with('TheaterPolicy').authorize('create')
    const theater = await request.validate(CreateTheaterDto)
    const { id } = auth.user!
    const newTheater = await this.service.create(id, theater)
    return response.created(newTheater)
  }

  // Update a Theater
  public async updateTheater({ request, auth, bouncer, response }: HttpContextContract) {
    await auth.authenticate()
    const body = await request.validate(UpdateTheaterDto)
    const { id } = request.param('id')
    const theater = await this.service.getById(id)
    if (!theater) {
      return response.notFound({ errors: [{ message: 'Theater not found!' }] })
    }
    await bouncer.with('TheaterPolicy').authorize('update', theater)
    const updatedTheater = await this.service.update(id, body).catch((err) => {
      return response.badRequest({ errors: [{ message: err.message, error: err }] })
    })
    if (!updatedTheater) {
      return response.unprocessableEntity({ errors: [{ message: 'Update failed!' }] })
    }
    return response.accepted({ message: 'Updated successfully!' })
  }

  // get nearby theaters
  public async getNearbyTheaters({ request, response }: HttpContextContract) {
    const { lat, lng, limit, range } = request.qs()
    if (!lat || !lng) {
      return response.badRequest({
        errors: [{ message: 'coordinates are required', required: ['lat', 'lng'] }],
      })
    }
    return await this.service.getNearbyTheaters([lat, lng], { limit, range })
  }

  // Get one by id
  public async getTheaterInfo({ request, response }: HttpContextContract) {
    const theaters = await this.service.getById(request.param('id'))
    if (!theaters) {
      return response.notFound({ errors: [{ message: 'Theater not found!' }] })
    }
    return theaters
  }

  // Get all by vendor
  public async getTheatersByVendor({ request }: HttpContextContract) {
    const theaters = await this.service.getList(request.param('id'))
    return theaters
  }

  // Delete a Theater
  public async deleteTheater({ request, bouncer, auth, response }: HttpContextContract) {
    await auth.authenticate()
    const theater = await this.service.getById(request.param('id'))
    if (!theater) {
      return response.notFound({ errors: [{ message: 'Theater not found!' }] })
    }
    await bouncer.with('TheaterPolicy').authorize('delete', theater)
    await this.service.delete(request.param('id')).catch((err) => {
      return response.internalServerError({ errors: [{ message: err.message, error: err }] })
    })
    return response.accepted({ message: 'Deleted successfully!' })
  }
}
