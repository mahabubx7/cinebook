/*
|-------------------------------------------------------------
| @AuditoriumService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Database from '@ioc:Adonis/Lucid/Database'
import Auditorium from 'App/Models/Auditorium'

export class AuditoriumService {
  constructor(private readonly model = Auditorium) {}

  /**
   * Create a new Auditorium
   * @params payload Partial<Auditorium>
   * @returns Promise<Auditorium>
   */
  public async create(payload: Partial<Auditorium>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Auditorium | null>
   * @includes Theater
   */
  public async getById(id: number) {
    let auditorium = await this.model
      .query()
      .where('id', id)
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })
      .first()

    if (auditorium) {
      auditorium.theater.location = JSON.parse(auditorium.theater.location)
    }

    return auditorium
  }

  /**
   * Get one by id (UID)
   * @param uid string
   * @returns Promise<Auditorium | null>
   * @includes Theater
   */
  public async getByUid(uid: string) {
    let auditorium = await this.model
      .query()
      .where('uid', uid)
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })
      .first()

    if (auditorium) {
      auditorium.theater.location = JSON.parse(auditorium.theater.location)
    }

    return auditorium
  }

  /**
   * Get list by Theater (id)
   * @param id number
   * @returns Promise<Auditorium[]>
   */
  public async getListByTheater(theaterId: number) {
    let auditoriums = await this.model
      .query()
      .where('is_deleted', false)
      .where('theater_id', theaterId)
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })

    auditoriums.forEach(async (item) => {
      item.theater.location = await JSON.parse(item.theater.location)
    })

    return auditoriums
  }

  /**
   * Update a Auditorium
   * @param id number
   * @param payload Partial<Auditorium>
   * @returns Promise<any[]>
   */
  public async update(id: number, payload: Partial<Auditorium>) {
    return this.model
      .query()
      .where('id', id)
      .update(payload)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Remove a Auditorium
   * @param id number
   * @returns Promise<any[]>
   */
  public async delete(id: number) {
    return this.model
      .query()
      .where('id', id)
      .update({ isDeleted: true })
      .then(() => true)
      .catch(() => false)
  }
}
