import vine from '@vinejs/vine'

export const addOrderItemValidator = vine.compile(
  vine.object({
    order_id: vine.number().exists({ table: 'orders', column: 'id' }),
    product_id: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
    // subtotal mengikuti tipe decimal(10, 2) di tabel order_items
    subtotal: vine.number().decimal([0, 2]).min(0),
  })
)

export const updateOrderItemValidator = vine.compile(
  vine.object({
    order_id: vine.number().exists({ table: 'orders', column: 'id' }),
    product_id: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1).optional(),
    subtotal: vine.number().decimal([0, 2]).min(0).optional(),
  })
)
