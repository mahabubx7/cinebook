import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  beforeCreate,
  beforeSave,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import { TokenService } from 'App/Services/TokenService'
import Movie from './Movie'

export default class Screening extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public movieId: number

  @column()
  public name: string

  @column()
  public running: boolean

  @column()
  public startTime: string

  @column()
  public endTime: string

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Movie, { foreignKey: 'movieId' })
  public movie: BelongsTo<typeof Movie>

  @beforeCreate()
  public static async generateUid(screening: Screening) {
    screening.uid = 'scr' + '--' + TokenService.UID(16)
  }

  @beforeSave()
  public static async checkTimeOverlapping(screening: Screening) {
    const { movieId, startTime, endTime } = screening
    const haveConflicts = await Screening.query()
      .where('movieId', movieId)
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
    if (haveConflicts) throw new Error('Screening time is overlapping with another screening!')
  }
}
