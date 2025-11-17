import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Address from './address.js'
import OrderItem from './order_item.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare order_code: string

  @column()
  declare user_id: number

  @column()
  declare shipping_address_id: number

  @column()
  declare total_price: number

  @column()
  declare status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  @column()
  declare payment_status: 'unpaid' | 'paid' | 'refunded'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Address, {
    foreignKey: 'shipping_address_id',
  })
  declare shippingAddress: BelongsTo<typeof Address>

  @hasMany(() => OrderItem, {
    foreignKey: 'order_id',
  })
  declare orderItems: HasMany<typeof OrderItem>
}
