import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'name_supplier' })
  declare nameSupplier: string

  @column()
  declare alamat: string

  @column({ columnName: 'phone_number' })
  declare phoneNumber: string

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Product, {
    foreignKey: 'supplierId',
  })
  declare products: HasMany<typeof Product>
}
