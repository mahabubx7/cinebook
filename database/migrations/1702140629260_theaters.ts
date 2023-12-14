import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'theaters'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uid').notNullable().unique()
      table.integer('vendor_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('type_id').notNullable().unsigned().references('id').inTable('theater_types')
      table.string('name').notNullable()
      table.string('address').notNullable()
      table.geometry('location').nullable() // geo location
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
