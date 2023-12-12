import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Logger from '@ioc:Adonis/Core/Logger'
import Theater from 'App/Models/Theater'
import TheaterType from 'App/Models/TheaterType'

export default class extends BaseSeeder {
  public async run() {
    await TheaterType.createMany([
      {
        name: 'Single Screen', // 1
      },
      {
        name: 'Multiplex', // 2
      },
    ]).then(() => {
      Logger.info('✅ Seeding TheaterTypes are completed!')
    })

    await Theater.createMany([
      {
        name: 'Cineplex Dhaka',
        address: 'Dhanmondi 27, Dhaka',
        vendorId: 2,
        uid: 'cineplex-dhaka',
        typeId: 2,
        location: Database.st().geomFromText('Point(23.746466 90.376015)', 4326),
        // location: Database.st().geomFromText('Point(23.746466 90.376015)', 4326),
        // location: 'Point(23.746466 90.376015)',
        // location: {
        //   type: 'Point',
        //   coordinates: [23.746466, 90.376015],
        // },
      },
      {
        name: 'Cineplex Khulna',
        uid: 'cineplex-khulna',
        address: 'Khulna',
        typeId: 1,
        vendorId: 2,
        location: Database.st().geomFromText('Point(22.845641 89.540328)', 4326),
        // location: {
        //   type: 'Point',
        //   coordinates: [22.845641, 89.540328],
        // },
        // location: Database.st().geomFromText('Point(22.845641 89.540328)', 4326),
        // location: 'Point(22.845641 89.540328)',
      },
    ]).then(() => {
      Logger.info('✅ Seeding Theaters are completed!')
    })
  }
}
