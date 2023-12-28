import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'movies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uid').notNullable().unique()
      table.integer('tmdb_id').notNullable().unique()
      table.string('name').notNullable()
      table.string('rated').nullable()
      table.float('rating').nullable().defaultTo(0)
      table.string('released_at').notNullable()
      table.boolean('is_deleted').defaultTo(false)

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
