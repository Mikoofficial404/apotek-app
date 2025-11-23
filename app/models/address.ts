import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Order from './order.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'recipient_name' })
  declare recipientName: string

  @column({ columnName: 'phone_number' })
  declare phoneNumber: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare province: string

  @column({ columnName: 'postal_code' })
  declare postalCode: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Order, {
    foreignKey: 'shippingAddressId',
  })
  declare orders: HasMany<typeof Order>
}
