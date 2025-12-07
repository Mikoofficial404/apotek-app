import vine from '@vinejs/vine'

export const CategoryValidator = vine.compile(
  vine.object({
    categoryName: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim(),
  })
)

export const CategoryUpdateValidator = vine.compile(
  vine.object({
    categoryName: vine.string().trim().minLength(3).maxLength(100).optional(),
    description: vine.string().trim().minLength(3).maxLength(100),
  })
)
