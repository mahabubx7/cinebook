import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingService } from 'App/Services'
import CreateBookingDto from 'App/Validators/booking/CreateBookingDto'

export default class BookingsController {
  constructor(private bookingService: BookingService = new BookingService()) {}

  public async create({ request, auth, response }: HttpContextContract) {
    const booking = await request.validate(CreateBookingDto)
    const { id } = auth.user!
    const created = await this.bookingService.create(id, booking)
    return response.created(created)
  }
}
