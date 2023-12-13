/*
|-------------------------------------------------------------
| @TheaterService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Database from '@ioc:Adonis/Lucid/Database'
import Theater from 'App/Models/Theater'

export class TheaterService {
  constructor(private readonly model = Theater) {}

  /**
   * Create a new Theater
   * @params payload Partial<Theater>
   * @returns Promise<Theater>
   */
  public async create(payload: Partial<Theater>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Theater | null>
   */
  public async getById(id: number) {
    const theater = await this.model
      .query()
      .where('id', id)
      .select('id', 'name', 'address', 'vendor_id', 'type_id', Database.st().asGeoJSON('location'))
      .first()
    if (!theater) return null
    theater.location = JSON.parse(theater.location)
    await theater.load('type', (query) => query.select('id', 'name'))
    await theater.load('owner', (query) => query.select('id', 'email'))
    return theater
  }

  /**
   * Update a Theater
   * @param id number
   * @param payload Partial<Theater>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Theater>) {
    return this.model.query().where('id', id).update(payload)
  }

  /**
   * Remove a Theater
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model.query().where('id', id).delete()
  }
}
