import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'screenings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('movie_id').notNullable().unsigned().references('id').inTable('movies')
      table.string('uid').notNullable().unique()
      table.string('name').notNullable()
      table.boolean('running').nullable().defaultTo(false)
      table.string('start_time').notNullable()
      table.string('end_time').notNullable()
      table.boolean('is_deleted').defaultTo(false)

      table.index(['movie_id', 'start_time', 'end_time'])
      table.unique(['movie_id', 'start_time', 'end_time']) // composite unique
      table.unique(['movie_id', 'name']) // small unique combination
      table.unique(['movie_id', 'start_time']) // small unique combination
      table.unique(['movie_id', 'end_time']) // small unique combination

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
