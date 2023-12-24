import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Booking from 'App/Models/Booking'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public async run() {
    await Booking.createMany([
      {
        seatNumber: '1',
        ownerId: 1,
        showId: 1,
        auditoriumId: 4,
        date: '2021-12-27',
        price: 100,
        status: 'booked',
      },
      {
        seatNumber: '2',
        ownerId: 1,
        showId: 1,
        auditoriumId: 4,
        date: '2021-12-27',
        price: 100,
      },
    ]).then(() => {
      Logger.info('✅ Seeding Bookings are completed!')
    })
  }
}
