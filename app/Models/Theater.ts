import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import TheaterType from './TheaterType'
import { TokenService } from 'App/Services'
import Auditorium from './Auditorium'
import Screening from './Screening'

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
  public timezone: string

  @column({ serializeAs: null })
  // @no-swagger
  public vendorId: number

  @column({ serializeAs: null })
  // @no-swagger
  public typeId: number

  @column()
  public address: string

  @column()
  public location: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'vendorId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => TheaterType, { foreignKey: 'typeId' })
  public type: BelongsTo<typeof TheaterType>

  @hasMany(() => Auditorium, { foreignKey: 'theaterId' })
  public auditoriums: HasMany<typeof Auditorium>

  @hasMany(() => Screening, { foreignKey: 'theaterId' })
  public screenings: HasMany<typeof Screening>

  @beforeCreate()
  public static async generateUid(theater: Theater) {
    theater.uid = TokenService.slugify(theater.name)
  }
}
