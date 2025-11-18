import vine from '@vinejs/vine'

// Digunakan saat membuat order baru
export const createOrderValidator = vine.compile(
  vine.object({
    order_code: vine.string().trim().maxLength(255),
    user_id: vine.number().exists({ table: 'users', column: 'id' }),
    shipping_address_id: vine.number().exists({ table: 'addresses', column: 'id' }),
    total_price: vine.number().decimal([0, 2]).min(0),
    // status & payment_status optional karena sudah ada default di database
    status: vine
      .string()
      .trim()
      .in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    payment_status: vine.string().trim().in(['unpaid', 'paid', 'refunded']).optional(),
  })
)

// Digunakan untuk update order (PATCH/PUT)
export const updateOrderValidator = vine.compile(
  vine.object({
    order_code: vine.string().trim().maxLength(255).optional(),
    user_id: vine.number().exists({ table: 'users', column: 'id' }).optional(),
    shipping_address_id: vine.number().exists({ table: 'addresses', column: 'id' }).optional(),
    total_price: vine.number().decimal([0, 2]).min(0).optional(),
    status: vine
      .string()
      .trim()
      .in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    payment_status: vine.string().trim().in(['unpaid', 'paid', 'refunded']).optional(),
  })
)

// Validasi khusus untuk endpoint cancel order
export const cancelOrderValidator = vine.compile(
  vine.object({
    status: vine.string().trim().in(['cancelled']),
    payment_status: vine.string().trim().in(['unpaid', 'refunded']).optional(),
  })
)

// Digunakan untuk filter / list order (query params)
export const listOrderValidator = vine.compile(
  vine.object({
    order_code: vine.string().trim().maxLength(255).optional(),
    user_id: vine.number().optional(),
    shipping_address_id: vine.number().optional(),
    status: vine
      .string()
      .trim()
      .in(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    payment_status: vine.string().trim().in(['unpaid', 'paid', 'refunded']).optional(),
  })
)
