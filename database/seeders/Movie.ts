import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Movie from 'App/Models/Movie'
import Logger from '@ioc:Adonis/Core/Logger'
import { Rating } from 'App/Enums'

export default class extends BaseSeeder {
  public async run() {
    await Movie.createMany([
      {
        name: 'Animal',
        tmdbId: 781732,
        releasedAt: '2023-12-01',
        rated: Rating.A,
      },
      {
        name: 'Dunki',
        tmdbId: 960876,
        releasedAt: '2023-12-21',
        rated: Rating.UA,
      },
    ]).then(() => {
      Logger.info('✅ Seeding Movies are completed!')
    })
  }
}
