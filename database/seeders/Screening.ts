import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Screening from 'App/Models/Screening'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public async run() {
    await Screening.createMany([
      {
        name: 'Animal (2023) - Early Morning Show',
        movieId: 1,
        running: true,
        startTime: '06:00',
        endTime: '09:50',
      },
      {
        name: 'Animal (2023) - Morning Show',
        movieId: 1,
        running: true,
        startTime: '10:30',
        endTime: '14:00',
      },
      {
        name: 'Animal (2023) - Day Show',
        movieId: 1,
        running: true,
        startTime: '14:30',
        endTime: '18:00',
      },
      {
        name: 'Animal (2023) - After Noon Show',
        movieId: 1,
        running: true,
        startTime: '18:30',
        endTime: '22:30',
      },
      {
        name: 'Animal (2023) - Night Show',
        movieId: 1,
        running: true,
        startTime: '23:00',
        endTime: '2:50',
      },
    ]).then(() => {
      Logger.info('✅ Seeding Screenings are completed!')
    })
  }
}
