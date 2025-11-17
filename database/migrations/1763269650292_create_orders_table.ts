import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('order_code').notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('shipping_address_id').unsigned().references('id').inTable('addresses')
      table.decimal('total_price', 10, 2).notNullable()
      table
        .enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .defaultTo('pending')
        .notNullable()
      table.enum('payment_status', ['unpaid', 'paid', 'refunded']).defaultTo('unpaid').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
