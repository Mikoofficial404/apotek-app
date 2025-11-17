import vine from '@vinejs/vine'

export const SupplierValidator = vine.compile(
  vine.object({
    name_supplier: vine.string().trim().minLength(3).maxLength(255),
    alamat: vine.string().trim().minLength(3).maxLength(255),
    phone: vine.number(),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value, field) => {
        const supplier = await db
          .from('suppliers')
          .whereNot('id', field.meta.supplier_id)
          .where('email', value)
          .first()
        return !supplier
      }),
  })
)
