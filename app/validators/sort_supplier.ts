import vine from '@vinejs/vine'

export const sortSupplier = vine.compile(
  vine.object({
    sort_by: vine
      .enum(['id', 'name_supplier', 'alamat', 'phone_number', 'email', 'created_at', 'updated_at'])
      .optional(),
    order_by: vine.enum(['asc', 'desc']).optional(),
  })
)
