/*
|-------------------------------------------------------------
| @ScreeningService class
| @Author: Mahabub (@mahabubx7)
|-------------------------------------------------------------
|
| This is a service class that can be used to handle database
| access layer delicately & handle necessary operations.
|
|*/

import Database from '@ioc:Adonis/Lucid/Database'
import Screening from 'App/Models/Screening'

export class ScreeningService {
  constructor(private readonly model = Screening) {}

  /**
   * Create a new Screening
   * @params payload Partial<Screening>
   * @returns Promise<Screening>
   */
  public async create(payload: Partial<Screening>) {
    return this.model.create(payload)
  }

  /**
   * Get one by id
   * @param id number
   * @returns Promise<Screening | null>
   */
  public async getById(id: number) {
    const screen = await this.model
      .query()
      .where('id', id)
      .preload('movie')
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })
      .first()

    if (!screen) return null
    screen.theater.location = await JSON.parse(screen.theater.location)
    return screen
  }

  /**
   * Get one by id (UID)
   * @param uid string
   * @returns Promise<Screening | null>
   */
  public async getByUid(uid: string) {
    const screen = await this.model
      .query()
      .where('uid', uid)
      .preload('movie')
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })
      .first()

    if (!screen) return null
    screen.theater.location = await JSON.parse(screen.theater.location)
    return screen
  }

  /**
   * Get list by movie id
   * @param movieId number
   * @param theaterId number
   * @returns Promise<Screening[]>
   */
  public async getListByMovieAndTheater(movieId: number, theaterId: number) {
    let screens = await this.model
      .query()
      .where('movieId', movieId)
      .andWhere('theaterId', theaterId)
      .preload('movie')
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })

    screens.forEach(async (screen) => {
      if (screen.theater.location) {
        screen.theater.location = await JSON.parse(screen.theater.location)
      }
    })

    return screens
  }

  /**
   * Get list by movie id
   * @param movieId number
   * @returns Promise<Screening[]>
   */
  public async getListByMovie(movieId: number) {
    let screens = await this.model
      .query()
      .where('movieId', movieId)
      .preload('movie')
      .preload('theater', async (query) => {
        await query.select('*', Database.st().asGeoJSON('location'))
      })

    screens.forEach(async (screen) => {
      if (screen.theater.location) {
        screen.theater.location = await JSON.parse(screen.theater.location)
      }
    })

    return screens
  }

  /**
   * Update a Screening
   * @param id number
   * @param payload Partial<Screening>
   * @returns Promise<boolean>
   */
  public async update(id: number, payload: Partial<Screening>) {
    return this.model
      .query()
      .where('id', id)
      .update(payload)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Remove a Screening
   * @param id number
   * @returns Promise<boolean>
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
