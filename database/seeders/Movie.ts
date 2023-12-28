import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Movie from 'App/Models/Movie'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await Movie.createMany([
      {
        name: 'Animal (A/18+)',
        tmdbId: 781732,
        releasedAt: DateTime.now().set({ year: 2023, month: 12, day: 1 }).toString(),
      },
    ]).then(() => {
      Logger.info('✅ Seeding Movies are completed!')
    })
  }
}
