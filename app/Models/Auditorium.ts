import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  beforeCreate,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { TokenService } from 'App/Services'
import Theater from './Theater'
import Screening from './Screening'

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

  @belongsTo(() => Theater, { foreignKey: 'theaterId' })
  public theater: BelongsTo<typeof Theater>

  @manyToMany(() => Screening, {
    pivotTable: 'screen_auditoriums',
    pivotTimestamps: true,
    pivotColumns: ['starts_at', 'ends_at', 'price'],
  })
  public screenings: ManyToMany<typeof Screening>

  @beforeCreate()
  public static async generateUid(auditorium: Auditorium) {
    auditorium.uid = this.name.toLowerCase() + '--' + TokenService.UID(16)
  }
}
