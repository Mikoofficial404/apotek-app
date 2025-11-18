import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    await this.schema.dropTableIfExists(this.tableName)

    await this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name_product').notNullable()
      table.integer('stock').notNullable()
      table.decimal('harga', 10, 2).notNullable()
      table.string('image_url').nullable()
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.integer('supplier_id').unsigned().references('id').inTable('suppliers')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
