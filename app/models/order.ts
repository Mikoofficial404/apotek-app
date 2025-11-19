import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Address from './address.js'
import OrderItem from './order_item.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'order_code' })
  declare orderCode: string

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'shipping_address_id' })
  declare shippingAddressId: number

  @column({ columnName: 'total_price' })
  declare totalPrice: number

  @column()
  declare status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  @column({ columnName: 'payment_status' })
  declare paymentStatus: 'unpaid' | 'paid' | 'refunded'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Address, {
    foreignKey: 'shippingAddressId',
  })
  declare shippingAddress: BelongsTo<typeof Address>

  @hasMany(() => OrderItem, {
    foreignKey: 'orderId',
  })
  declare orderItems: HasMany<typeof OrderItem>

  @beforeCreate()
  public static async setOrder(order: Order) {
    order.orderCode = 'ORD-' + randomUUID().split('-')[0].toUpperCase()
  }
}
