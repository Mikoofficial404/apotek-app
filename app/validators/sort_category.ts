import vine from '@vinejs/vine'

export const sortCategory = vine.compile(
  vine.object({
    sort_by: vine.enum(['id', 'category_name', 'created_at', 'updated_at']).optional(),
    order_by: vine.enum(['asc', 'desc']).optional(),
  })
)
