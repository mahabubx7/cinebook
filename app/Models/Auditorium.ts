import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { TokenService } from 'App/Services'
import Theater from './Theater'

export default class Auditorium extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public theaterId: number

  @column()
  public capacity: number

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(auditorium: Auditorium) {
    auditorium.uid = this.name.toLowerCase() + '--' + TokenService.UID(16)
  }

  @belongsTo(() => Theater, { foreignKey: 'theaterId' })
  public theater: BelongsTo<typeof Theater>
}
