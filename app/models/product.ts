import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Supplier from './supplier.js'
import CartItem from './cart_item.js'
import OrderItem from './order_item.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name_product' })
  declare nameProduct: string

  @column()
  declare stock: number

  @column()
  declare harga: number

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @column({ columnName: 'supplier_id' })
  declare supplierId: number

  @column({ columnName: 'deskripsi' })
  declare deskripsi: string | null

  @column({ columnName: 'indikasi' })
  declare indikasi: string | null

  @column({ columnName: 'harga_beli' })
  declare hargaBeli: number | null

  @column({ columnName: 'harga_jual' })
  declare hargaJual: number | null

  @column.date({ columnName: 'tanggal_obat' })
  declare tanggalObat: DateTime | null

  @column.date({ columnName: 'kadaluwarsa' })
  declare kadaluwarsa: DateTime | null

  // @column({ columnName: 'dosis' })
  // declare dosis: string

  // @column({ columnName: 'aturan_pakai' })
  // declare aturanPakai: string

  // @column({ columnName: 'efek_samping' })
  // declare efekSamping: string

  // @column({ columnName: 'komposisi' })
  // declare komposisi: string

  // @column({ columnName: 'kemasan' })
  // declare kemasan: string

  // @column({ columnName: 'no_register' })
  // declare noRegister: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Supplier, {
    foreignKey: 'supplierId',
  })
  declare supplier: BelongsTo<typeof Supplier>

  @hasMany(() => CartItem, {
    foreignKey: 'productId',
  })
  declare cartItems: HasMany<typeof CartItem>

  @hasMany(() => OrderItem, {
    foreignKey: 'productId',
  })
  declare orderItems: HasMany<typeof OrderItem>
}
