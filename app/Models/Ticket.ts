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
import { TokenService } from 'App/Services'
import Booking from './Booking'
import User from './User'
import Screening from './Screening'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public ownerId: number

  @column()
  public showId: number

  @column()
  public price: number

  @column()
  public isPaid: boolean

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  public owner: BelongsTo<typeof User>

  @hasMany(() => Booking, {})
  public seats: HasMany<typeof Booking>

  @belongsTo(() => Screening, { foreignKey: 'showId' })
  public show: BelongsTo<typeof Screening>

  @beforeCreate()
  public static generateUid(ticket: Ticket) {
    ticket.uid = TokenService.UID(8, { doubleGen: true, upperCase: true })
  }
}
