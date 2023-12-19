import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { TokenService } from 'App/Services'
import Screening from './Screening'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public imdb?: string

  @column()
  public rated?: string

  @column()
  public rating?: number

  @column()
  public released: DateTime

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(movie: Movie) {
    movie.uid = 'mov' + '--' + TokenService.UID(16)
  }

  @hasMany(() => Screening, { foreignKey: 'movieId' })
  public screens: HasMany<typeof Screening>
}
