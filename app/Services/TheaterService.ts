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
   * @params payload CreateTheaterDto
   * @returns Promise<Theater>
   */
  public async create(
    ownerId: number,
    payload: {
      name: string
      address: string
      coordinates?: number[]
      type?: number
    }
  ) {
    const theater: Partial<Theater> = {
      name: payload.name,
      address: payload.address,
      location: payload.coordinates
        ? Database.st().geomFromText(
            `Point(${payload.coordinates[0]} ${payload.coordinates[1]})`,
            4326
          )
        : undefined,
      typeId: payload.type ? Number(payload.type) : 1,
      vendorId: ownerId, // owner
    } // <--- New Theater record

    return await this.model
      .create(theater)
      .then((t) => {
        return this.getById(t.id)
      })
      .catch((err) => {
        throw err
      })
  }

  /**
   * Get one by id
   * @param id number
   * @parsed location GeoJSON <PostGIS>
   * @includes TheaterType, User<Owner>
   * @returns Promise<Theater | null>
   */
  public async getById(id: number) {
    const theater = await this.model
      .query()
      .where('id', id)
      .select('*', Database.st().asGeoJSON('location'))
      .first()
    if (!theater) return null
    theater.location = JSON.parse(theater.location)
    await theater.load('type', (query) => query.select('id', 'name'))
    await theater.load('owner', (query) => query.select('id', 'email'))
    return theater
  }

  /**
   * Get list of Theaters by vendor
   * @param vendor number (vendorId)
   * @parsed location GeoJSON <PostGIS>
   * @includes TheaterType, User<Owner>
   * @returns Promise<Theater[]>
   */
  public async getList(vendor: number) {
    let theaters = await this.model
      .query()
      .where('vendor_id', vendor)
      .select('*', Database.st().asGeoJSON('location'))
      .preload('type', (query) => query.select('id', 'name'))
      .preload('owner', (query) => query.select('id', 'email'))
      .then((list) => {
        return list.map((t) => {
          t.location = JSON.parse(t.location)
          return t
        })
      })
    return theaters
  }

  /**
   * Get list of Theaters by vendor
   * @param coordinates [number, number] (lat, lng)
   * @param limit number (10 by default)
   * @param range number (3km by default)
   * @includes TheaterType, User<Owner>
   * @returns Promise<Theater[]>
   */
  public async getNearbyTheaters(
    coordinates: [number, number],
    { range = 3000, limit = 10 }: { range?: number; limit?: number } = {}
  ) {
    let theaters = await Theater.query()
      .select(
        '*',
        Database.raw(
          'ST_Distance(location::geometry, ST_MakePoint(?, ?)::geography) AS distance',
          coordinates
        )
      )
      .whereRaw('ST_DWithin(location::geography, ST_MakePoint(?, ?)::geography, ?)', [
        ...coordinates,
        range,
      ])
      .orderBy('distance')
      .limit(limit)
      .preload('type', (query) => query.select('id', 'name'))
      .preload('owner', (query) => query.select('id', 'email'))
      .select('*', Database.st().asGeoJSON('location'))
      .then((list) => {
        return list.map((t) => {
          t.location = JSON.parse(t.location)
          return t
        })
      })

    return theaters
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
