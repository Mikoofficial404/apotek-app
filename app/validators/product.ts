import vine from '@vinejs/vine'

export const ProductValidator = vine.compile(
  vine.object({
    nameProduct: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number(),
    harga: vine.number().decimal([0, 2]).min(0),
    imageUrl: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    categoryId: vine.number().exists({ table: 'categories', column: 'id' }),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
  })
)

export const UpdateValidator = vine.compile(
  vine.object({
    nameProduct: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number(),
    harga: vine.number().decimal([0, 2]).min(0),
    imageUrl: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      })
      .optional(),
    categoryId: vine.number().exists({ table: 'categories', column: 'id' }),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
  })
)

export const DeleteValidator = vine.compile(
  vine.object({
    nameProduct: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number(),
    harga: vine.number().decimal([0, 2]).min(0),
    imageUrl: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      })
      .optional(),
    categoryId: vine.number().exists({ table: 'categories', column: 'id' }),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
  })
)
