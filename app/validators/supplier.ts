import vine from '@vinejs/vine'

export const SupplierValidator = vine.compile(
  vine.object({
    name_supplier: vine.string().trim().minLength(3).maxLength(255),
    alamat: vine.string().trim().minLength(3).maxLength(255),
    phone_number: vine.string().trim().maxLength(20),
    email: vine.string().trim().email().unique({ table: 'suppliers', column: 'email' }),
  })
)

export const SupplierUpdateValidator = vine.compile(
  vine.object({
    name_supplier: vine.string().trim().minLength(3).maxLength(255).optional(),
    alamat: vine.string().trim().minLength(3).maxLength(255).optional(),
    phone_number: vine.string().trim().maxLength(20).optional(),
    email: vine.string().trim().email().optional(),
  })
)
