import vine from '@vinejs/vine'

export const SupplierValidator = vine.compile(
  vine.object({
    nameSupplier: vine.string().trim().minLength(3).maxLength(255),
    alamat: vine.string().trim().minLength(3).maxLength(255),
    phoneNumber: vine.string().trim().maxLength(20),
    email: vine.string().trim().email().unique({ table: 'suppliers', column: 'email' }),
  })
)

export const SupplierUpdateValidator = vine.compile(
  vine.object({
    nameSupplier: vine.string().trim().minLength(3).maxLength(255).optional(),
    alamat: vine.string().trim().minLength(3).maxLength(255).optional(),
    phoneNumber: vine.string().trim().maxLength(20).optional(),
    email: vine.string().trim().email().optional(),
  })
)
