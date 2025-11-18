import vine from '@vinejs/vine'

export const sortProduct = vine.compile(
  vine.object({
    sort_by: vine
      .enum([
        'id',
        'name_product',
        'stock',
        'harga',
        'image_url',
        'category_id',
        'supplier_id',
        'created_at',
        'updated_at',
      ])
      .optional(),
    order_by: vine.enum(['asc', 'desc']).optional(),
  })
)
