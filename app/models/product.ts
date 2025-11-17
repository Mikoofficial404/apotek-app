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

  @column()
  declare nameProduct: string

  @column()
  declare stock: number

  @column()
  declare harga: number

  @column()
  declare image_url: string

  @column()
  declare category_id: number

  @column()
  declare supplier_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category, {
    foreignKey: 'category_id',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Supplier, {
    foreignKey: 'supplier_id',
  })
  declare supplier: BelongsTo<typeof Supplier>

  @hasMany(() => CartItem, {
    foreignKey: 'product_id',
  })
  declare cartItems: HasMany<typeof CartItem>

  @hasMany(() => OrderItem, {
    foreignKey: 'product_id',
  })
  declare orderItems: HasMany<typeof OrderItem>
}
