import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        fname: 'User',
        lname: 'Test',
        email: 'test@user.com', // user
        password: '12345678',
        isEmailVerified: true,
      },
      {
        fname: 'Vendor',
        lname: 'Test',
        email: 'test@vendor.com',
        password: '12345678',
        role: 'vendor', // vendor
        isEmailVerified: true,
      },
      {
        fname: 'Manager',
        lname: 'Test',
        email: 'test@manager.com',
        password: '12345678',
        role: 'manager', // manager
        isEmailVerified: true,
      },
      {
        fname: 'Admin',
        lname: 'Test',
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
