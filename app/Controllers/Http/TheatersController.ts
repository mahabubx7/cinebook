import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TheaterService } from 'App/Services'
import CreateTheaterDto from 'App/Validators/theater/create-dto'

export default class TheatersController {
  constructor(private readonly service = new TheaterService()) {}

  // Create a new Theater
  public async addTheater({ request, auth, response }: HttpContextContract) {
    const theater = await request.validate(CreateTheaterDto)
    const { id } = auth.user!
    const newTheater = await this.service.create(id, theater)
    return response.created(newTheater)
  }

  // get nearby theaters
  public async getNearbyTheaters({ request }: HttpContextContract) {
    const { lat, lng, limit, range } = request.qs()
    const theaters = await this.service.getNearbyTheaters([lat, lng], { limit, range })
    return theaters
  }

  // Get one by id
  public async getTheaterInfo({ request }: HttpContextContract) {
    const theaters = await this.service.getById(request.param('id'))
    return theaters
  }

  // Get all by vendor
  public async getTheatersByVendor({ request }: HttpContextContract) {
    const theaters = await this.service.getList(request.param('id'))
    return theaters
  }
}
