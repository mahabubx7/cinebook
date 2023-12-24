/*
|-------------------------------------------------------------
| @BookingService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Database from '@ioc:Adonis/Lucid/Database'
import CustomException from 'App/Exceptions/CustomException'
import Booking from 'App/Models/Booking'

interface CreateBookParams {
  showId: number
  auditoriumId: number
  date: string
  seats: string[]
}

export class BookingService {
  constructor(private readonly model = Booking) {}

  /**
   * Create a new Booking
   * @param userId number
   * @param payload CreateBookParams
   * @returns Promise<Booking[]>
   */
  public async create(userId: number, payload: CreateBookParams) {
    const { showId, auditoriumId, date, seats } = payload
    const auditorium = await Database.query()
      .from('screen_auditoriums')
      .where('screening_id', showId)
      .leftJoin('auditoriums', 'auditoriums.id', 'screen_auditoriums.auditorium_id')
      .select('auditoriums.id', 'screen_auditoriums.price')
      .first()
    const bookings = await this.model
      .createMany([
        ...seats.map((seat) => ({
          ownerId: userId,
          showId,
          auditoriumId,
          date,
          seatNumber: seat,
          price: auditorium.price,
        })),
      ])
      .catch((err) => {
        console.log(err)
        throw new CustomException('Error while creating booking', 409)
      })

    return bookings
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Booking>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Booking
   * @param id number
   * @param payload Partial<Booking>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Booking>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Booking
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
