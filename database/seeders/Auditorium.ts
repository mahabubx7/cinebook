import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Auditorium from 'App/Models/Auditorium'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public async run() {
    await Auditorium.createMany([
      {
        name: 'Meteor',
        theaterId: 1,
        capacity: 50,
      },
      {
        name: 'Star',
        theaterId: 1,
        capacity: 100,
      },
      {
        name: 'Galaxy (IMAX)',
        theaterId: 1,
        capacity: 200,
      },
    ]).then(() => {
      Logger.info('✅ Seeding Auditoriums are completed!')
    })
  }
}
