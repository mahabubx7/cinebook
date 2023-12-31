import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Role } from 'App/Enums'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('fname', 32).notNullable()
      table.string('lname', 32).notNullable()
      table.string('middle', 32).nullable()
      table.string('email', 255).notNullable().unique()
      table.string('phone', 64).nullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('is_email_verified').defaultTo(false)
      table.enum('role', Object.values(Role)).defaultTo(Role.USER)
      table.boolean('is_active').defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
