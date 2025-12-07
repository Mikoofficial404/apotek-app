import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('harga_beli', 12, 2).nullable()
      table.decimal('harga_jual', 12, 2).nullable()
      table.date('tanggal_obat').nullable()
      table.date('kadaluwarsa').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('harga_beli')
      table.dropColumn('harga_jual')
      table.dropColumn('tanggal_obat')
      table.dropColumn('kadaluwarsa')
    })
  }
}
