import vine from '@vinejs/vine'

export const CategoryValidator = vine.compile(
  vine.object({
    category_name: vine.string().trim().minLength(3).maxLength(100),
    // slug dan description belum ada di tabel categories, jadi tidak divalidasi di sini
  })
)

export const CategoryUpdateValidator = vine.compile(
  vine.object({
    category_name: vine.string().trim().minLength(3).maxLength(100).optional(),
  })
)
