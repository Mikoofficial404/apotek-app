import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('label').notNullable()
      table.string('recipient_name').notNullable()
      table.integer('phone_number').notNullable()
      table.text('address').notNullable()
      table.string('city').notNullable()
      table.string('province').notNullable()
      table.string('postal_code').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
