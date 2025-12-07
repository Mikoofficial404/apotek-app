import vine from '@vinejs/vine'

export const ProductValidator = vine.compile(
  vine.object({
    nameProduct: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number(),
    imageUrl: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    categoryId: vine.number().exists({ table: 'categories', column: 'id' }),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
    deskripsi: vine.string().trim(),
    indikasi: vine.string().trim(),
    hargaBeli: vine.number(),
    hargaJual: vine.number(),
    tanggalObat: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }),
    kadaluwarsa: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }),
    // description: vine.string().minLength(50).maxLength(2555),
  })
)

export const UpdateValidator = vine.compile(
  vine.object({
    nameProduct: vine.string().trim().minLength(3).maxLength(255),
    stock: vine.number(),
    imageUrl: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      })
      .optional(),
    categoryId: vine.number().exists({ table: 'categories', column: 'id' }),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
    deskripsi: vine.string().trim(),
    indikasi: vine.string().trim(),
    hargaBeli: vine.number().optional(),
    hargaJual: vine.number().optional(),
    tanggalObat: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }).optional(),
    kadaluwarsa: vine.date({ formats: ['YYYY-MM-DD', 'iso8601'] }).optional(),
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
