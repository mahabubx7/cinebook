import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BookingStatus } from 'App/Enums'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('show_id').notNullable().unsigned().references('id').inTable('screenings')
      table.integer('seat_id').notNullable().unsigned().references('id').inTable('seats')
      table.integer('owner_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('ticket_id').notNullable().unsigned().references('id').inTable('tickets')
      table.date('date').notNullable()
      table.float('price').notNullable()
      table.enum('status', Object.values(BookingStatus)).defaultTo(BookingStatus.PENDING)
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
