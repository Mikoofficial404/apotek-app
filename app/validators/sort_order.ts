import vine from '@vinejs/vine'

export const sortOrder = vine.compile(
  vine.object({
    sort_by: vine
      .enum(['order_code', 'user_id', 'shipping_address', 'total_price', 'status'])
      .optional(),
    order_by: vine.enum(['asc', 'desc']).optional(),
  })
)
