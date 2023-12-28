import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Ticket from './Ticket'
import User from './User'
import Screening from './Screening'
import Auditorium from './Auditorium'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public showId: number

  @column()
  public auditoriumId: number

  @column()
  public ownerId: number

  @column()
  public ticketId?: number

  @column()
  public seatNumber: string

  @column()
  public price: number

  @column()
  public date: string

  @column()
  public status: string

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Auditorium, { foreignKey: 'auditoriumId' })
  public auditorium: BelongsTo<typeof Auditorium>

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Screening, { foreignKey: 'showId' })
  public show: BelongsTo<typeof Screening>

  @belongsTo(() => Ticket, { foreignKey: 'ticketId' })
  public ticket: BelongsTo<typeof Ticket>
}
