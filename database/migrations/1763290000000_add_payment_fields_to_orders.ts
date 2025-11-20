import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('payment_method').nullable()
      table.string('payment_token').nullable()
      table.text('payment_url').nullable()
      table.timestamp('payment_expired_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('payment_method')
      table.dropColumn('payment_token')
      table.dropColumn('payment_url')
      table.dropColumn('payment_expired_at')
    })
  }
}
