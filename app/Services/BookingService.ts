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

import Booking from 'App/Models/Booking'

export class BookingService {
  constructor(private readonly model = Booking) {}

  /**
   * Create a new Booking
   * @params payload Partial<Booking>
   * @returns Promise<Booking>
   */
  public async create(payload: Partial<Booking>) {
    return this.model.create(payload)
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
