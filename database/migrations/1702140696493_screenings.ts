import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DateTime } from 'luxon'

export default class extends BaseSchema {
  protected tableName = 'screenings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('movie_id').notNullable().unsigned().references('id').inTable('movies')
      table.integer('theater_id').notNullable().unsigned().references('id').inTable('theaters')
      table.string('uid').notNullable().unique()
      table.string('name').notNullable()
      table.boolean('running').nullable().defaultTo(false)
      table.string('start_time').notNullable()
      table.string('end_time').notNullable()
      table.string('booking_start_date').defaultTo(DateTime.now().toISODate())
      table.string('screening_open_at').notNullable()
      table.string('screening_end_at').notNullable()
      table.boolean('is_deleted').defaultTo(false)

      // indexes
      table.index('name')
      table.index('booking_start_date')
      table.index(['movie_id', 'theater_id'])
      table.index(['movie_id', 'theater_id', 'start_time', 'end_time'])
      table.index(['screening_open_at', 'screening_end_at'])

      // unique constrains
      table.unique(['movie_id', 'theater_id', 'start_time', 'end_time']) // composite unique
      table.unique(['movie_id', 'theater_id', 'start_time']) // small unique combination
      table.unique(['movie_id', 'theater_id', 'end_time']) // small unique combination

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
