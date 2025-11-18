import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Address from './address.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'
import Order from './order.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare role: 'admin' | 'user'

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Address, {
    foreignKey: 'user_id',
  })
  declare addresses: HasMany<typeof Address>

  @hasMany(() => Cart, {
    foreignKey: 'user_id',
  })
  declare carts: HasMany<typeof Cart>

  @hasMany(() => Order, {
    foreignKey: 'user_id',
  })
  declare orders: HasMany<typeof Order>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30m',
  })
}
