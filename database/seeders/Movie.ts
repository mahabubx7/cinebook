import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Movie from 'App/Models/Movie'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await Movie.createMany([
      {
        name: 'Animal (2023)',
        imdb: 'tt13751694',
        released: DateTime.now().set({ year: 2023, month: 12, day: 1 }),
      },
    ]).then(() => {
      Logger.info('✅ Seeding Movies are completed!')
    })
  }
}
