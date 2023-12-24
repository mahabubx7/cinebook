import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BookingStatus } from 'App/Enums'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('show_id').notNullable().unsigned().references('id').inTable('screenings')
      table
        .integer('auditorium_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('auditoriums')
      table.string('seat_number').notNullable()
      table.date('date').notNullable()
      table.float('price').notNullable()
      table.enum('status', Object.values(BookingStatus)).defaultTo(BookingStatus.PENDING)
      table.boolean('is_deleted').defaultTo(false)

      // index
      // table.index('owner_id', 'booking_owner_index')
      // table.index('show_id', 'booking_by_show_index')
      // table.index(['show_id', 'auditorium_id', 'date', 'seat_number'], 'booking_index')

      // unique combinations :: show_id + auditorium_id + seat_number + date
      table.unique(['show_id', 'auditorium_id', 'seat_number', 'date'])

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
