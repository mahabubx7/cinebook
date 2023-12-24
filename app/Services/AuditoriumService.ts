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
import CustomException from 'App/Exceptions/CustomException'
import Auditorium from 'App/Models/Auditorium'

interface AssignShowsParams {
  shows: number[] // screenings ids
  prices: number[] // price per show by index
  starts: string // start dateTime
  ends: string // end dateTime
}

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

  /**
   * Assign shows to Auditorium
   * @param id number
   * @param data AssignShowsParams
   * @returns Promise<boolean>
   * @throws CustomException | DatabaseError
   */
  public async assignShows(id: number, data: AssignShowsParams) {
    console.info('PARAMS --> ', data)
    const { shows, prices, starts, ends } = data
    const pivotData = shows.map((show, index) => {
      return {
        screening_id: show,
        auditorium_id: id,
        price: prices[index] || undefined,
        starts_at: starts,
        ends_at: ends,
      }
    })

    const auditorium = await this.model.find(id)
    if (!auditorium) throw new CustomException('Auditorium not found', 404)
    return await Database.table('screen_auditoriums')
      .insert(pivotData)
      .then(() => true)
      .catch((err) => {
        throw err
      })
  }

  public async getAuditoriumsByShow(theaterId: number, screeningId: number) {
    const auditoriums = await this.model
      .query()
      .where('is_deleted', false)
      .andWhereHas('screenings', (query) => {
        query.where('screening_id', screeningId)
      })
      .andWhereHas('theater', (query) => {
        query.where('theater_id', theaterId)
      })
    return auditoriums
  }
}
