import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { TokenService } from 'App/Services/TokenService'
import Movie from './Movie'
import Theater from './Theater'
import CustomException from 'App/Exceptions/CustomException'
import Auditorium from './Auditorium'

export default class Screening extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public movieId: number

  @column()
  public theaterId: number

  @column()
  public name: string

  @column()
  public running: boolean

  @column()
  public startTime: string

  @column()
  public endTime: string

  @column()
  public bookingStartDate: string

  @column()
  public screeningOpenAt: string

  @column()
  public screeningEndAt: string

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Movie, { foreignKey: 'movieId' })
  public movie: BelongsTo<typeof Movie>

  @belongsTo(() => Theater, { foreignKey: 'theaterId' })
  public theater: BelongsTo<typeof Theater>

  @manyToMany(() => Auditorium, {
    pivotTable: 'screen_auditoriums',
    pivotTimestamps: true,
    pivotColumns: ['starts_at', 'ends_at', 'price'],
  })
  public auditoriums: ManyToMany<typeof Auditorium>

  @beforeCreate()
  public static async generateUid(screening: Screening) {
    screening.uid = 'scr' + '--' + TokenService.UID(16)
  }

  @beforeSave()
  public static async checkTimeOverlapping(screening: Screening) {
    const { movieId, theaterId, startTime, endTime } = screening
    const haveConflicts = await Screening.query()
      .where('movieId', movieId)
      .andWhere('theaterId', theaterId)
      .andWhereRaw(
        `
      (
        (start_time < ? AND end_time > ?)
        OR
        (start_time <? AND end_time > ?)
      )
    `,
        [endTime, startTime, startTime, endTime]
      )
      .first()
    if (haveConflicts) {
      throw new CustomException('Time slot is overlapping', 409)
    }
  }
}
