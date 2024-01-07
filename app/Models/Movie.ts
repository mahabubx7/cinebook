import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Screening from './Screening'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public tmdbId: number

  @column()
  public rated?: string

  @column()
  public rating?: number

  @column()
  public releasedAt: string

  @column({ serializeAs: null })
  // @no-swagger
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid(movie: Movie) {
    const movieName = movie.name.replace(/\s/g, '').toString().split('(')[0]
    movie.uid = movieName.toLowerCase() + '-' + new Date(movie.releasedAt).getFullYear()
  }

  @hasMany(() => Screening, { foreignKey: 'movieId' })
  public screens: HasMany<typeof Screening>
}
