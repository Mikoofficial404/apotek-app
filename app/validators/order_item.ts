import vine from '@vinejs/vine'

export const addOrderItemValidator = vine.compile(
  vine.object({
    orderId: vine.number().exists({ table: 'orders', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
    subtotal: vine.number().decimal([0, 2]).min(0),
  })
)

export const updateOrderItemValidator = vine.compile(
  vine.object({
    orderId: vine.number().exists({ table: 'orders', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1).optional(),
    subtotal: vine.number().decimal([0, 2]).min(0).optional(),
  })
)
