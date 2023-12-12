/*
|-------------------------------------------------------------
| @SeatService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Seat from 'App/Models/Seat'

export class SeatService {
  constructor(private readonly model = Seat) {}

  /**
   * Create a new Seat
   * @params payload Partial<Seat>
   * @returns Promise<Seat>
   */
  public async create(payload: Partial<Seat>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Seat>
   */
  public async getById(id: number) {
    return this.model.findOrFail(id)
  }

  /**
   * Update a Seat
   * @param id number
   * @param payload Partial<Seat>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Seat>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Seat
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
