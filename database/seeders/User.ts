import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'test@user.com', // user
        password: '12345678',
        isEmailVerified: true,
      },
      {
        email: 'test@vendor.com',
        password: '12345678',
        role: 'vendor', // vendor
        isEmailVerified: true,
      },
      {
        email: 'test@manager.com',
        password: '12345678',
        role: 'manager', // manager
        isEmailVerified: true,
      },
      {
        email: 'test@admin.com',
        password: '12345678',
        role: 'admin', // admin
        isEmailVerified: true,
      },
    ]).then(() => {
      Logger.info('✅ Seeding Users are completed!')
    })
  }
}
