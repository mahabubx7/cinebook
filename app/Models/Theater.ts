import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Theater extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column()
  public name: string

  @column()
  public vendorId: number

  @column()
  public typeId: number

  @column()
  public address: string

  @column()
  public location: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static get computed() {
    return ['latitude', 'longitude']
  }

  public getLatitude({ location }) {
    return location.coordinates[0]
  }

  public getLongitude({ location }) {
    return location.coordinates[1]
  }
}
