import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    orderCode: vine.string().trim().maxLength(255),
    userId: vine.number().exists({ table: 'users', column: 'id' }),
    shippingAddressId: vine.number().exists({ table: 'addresses', column: 'id' }),
    totalPrice: vine.number().decimal([0, 2]).min(0),
    status: vine
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const)
      .optional(),
    paymentStatus: vine.enum(['unpaid', 'paid', 'refunded'] as const).optional(),
  })
)

export const updateOrderValidator = vine.compile(
  vine.object({
    orderCode: vine.string().trim().maxLength(255).optional(),
    userId: vine.number().exists({ table: 'users', column: 'id' }).optional(),
    shippingAddressId: vine.number().exists({ table: 'addresses', column: 'id' }).optional(),
    totalPrice: vine.number().decimal([0, 2]).min(0).optional(),
    status: vine
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const)
      .optional(),
    paymentStatus: vine.enum(['unpaid', 'paid', 'refunded'] as const).optional(),
  })
)

export const cancelOrderValidator = vine.compile(
  vine.object({
    status: vine.enum(['cancelled'] as const),
    paymentStatus: vine.enum(['unpaid', 'refunded'] as const).optional(),
  })
)

export const listOrderValidator = vine.compile(
  vine.object({
    orderCode: vine.string().trim().maxLength(255).optional(),
    userId: vine.number().optional(),
    shippingAddressId: vine.number().optional(),
    status: vine
      .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const)
      .optional(),
    paymentStatus: vine.enum(['unpaid', 'paid', 'refunded'] as const).optional(),
  })
)

export const checkoutValidator = vine.compile(
  vine.object({
    cartId: vine.number().exists({ table: 'carts', column: 'id' }),
    shippingAddressId: vine.number().exists({ table: 'addresses', column: 'id' }),
    paymentMethod: vine.enum(['midtrans', 'manual'] as const),
  })
)
