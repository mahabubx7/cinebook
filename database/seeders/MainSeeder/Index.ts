import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  public async run() {
    // Write your database queries inside the run method
    await this.runSeeder(await import('../User')) // <--- User (Public/Vendor/Admin/etc.)
    await this.runSeeder(await import('../Theater')) // <--- Theater
  }
}
