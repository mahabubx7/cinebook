import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Screening from 'App/Models/Screening'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'

export default class extends BaseSeeder {
  public async run() {
    await Screening.createMany([
      {
        name: 'Animal (2023) - Early Morning Show',
        movieId: 1,
        theaterId: 2,
        running: true,
        startTime: '06:00',
        endTime: '09:50',
        screeningOpenAt: '2023-12-01 00:00:00',
        screeningEndAt: '2023-12-30 23:59:59',
      },
      {
        name: 'Animal (2023) - Morning Show',
        movieId: 1,
        theaterId: 2,
        running: true,
        startTime: '10:30',
        endTime: '14:00',
        screeningOpenAt: '2023-12-01 00:00:00',
        screeningEndAt: '2023-12-30 23:59:59',
      },
      {
        name: 'Animal (2023) - Day Show',
        movieId: 1,
        theaterId: 2,
        running: true,
        startTime: '14:30',
        endTime: '18:00',
        screeningOpenAt: '2023-12-01 00:00:00',
        screeningEndAt: '2023-12-30 23:59:59',
      },
      {
        name: 'Animal (2023) - After Noon Show',
        movieId: 1,
        theaterId: 2,
        running: true,
        startTime: '18:30',
        endTime: '22:30',
        screeningOpenAt: '2023-12-01 00:00:00',
        screeningEndAt: '2023-12-30 23:59:59',
      },
      {
        name: 'Animal (2023) - Night Show',
        movieId: 1,
        theaterId: 2,
        running: true,
        startTime: '23:00',
        endTime: '2:50',
        screeningOpenAt: '2023-12-01 00:00:00',
        screeningEndAt: '2023-12-30 23:59:59',
      },
    ]).then(() => {
      Logger.info('✅ Seeding Screenings are completed!')
    })

    // attach to auditoriums
    await Database.table('screen_auditoriums')
      .multiInsert([
        {
          screening_id: 1,
          auditorium_id: 5,
          price: 99.99,
          starts_at: '2023-12-01',
          ends_at: '2024-01-01',
        },
        {
          screening_id: 2,
          auditorium_id: 5,
          price: 99.99,
          starts_at: '2023-12-01',
          ends_at: '2024-01-01',
        },
        {
          screening_id: 3,
          auditorium_id: 5,
          price: 99.99,
          starts_at: '2023-12-01',
          ends_at: '2024-01-01',
        },
        {
          screening_id: 4,
          auditorium_id: 5,
          price: 99.99,
          starts_at: '2023-12-01',
          ends_at: '2024-01-01',
        },
        {
          screening_id: 5,
          auditorium_id: 5,
          price: 99.99,
          starts_at: '2023-12-01',
          ends_at: '2024-01-01',
        },
      ])
      .then(() => {
        Logger.info('✅ Seeding Screenings attached to Auditorium is completed!')
      })
  }
}
