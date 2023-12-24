import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'screen_auditoriums'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('screening_id').unsigned().references('id').inTable('screenings')
      table.integer('auditorium_id').unsigned().references('id').inTable('auditoriums')
      table.float('price').defaultTo(250)
      table.string('starts_at').notNullable()
      table.string('ends_at').notNullable()

      // indexes
      table.index(['screening_id', 'auditorium_id'])

      // unique constrains
      table.unique(['screening_id', 'auditorium_id']) // composite unique
      table.unique(['screening_id', 'auditorium_id', 'starts_at', 'ends_at']) // unique combination

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
