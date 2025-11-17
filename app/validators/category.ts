import vine from '@vinejs/vine'

export const CategoryValidator = vine.compile(
  vine.object({
    category_name: vine.string().trim().minLength(3).maxLength(100),
    slug: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: vine.string().trim().maxLength(500).optional(),
  })
)

export const CategoryUpdateValidator = vine.compile(
  vine.object({
    category_name: vine.string().trim().minLength(3).maxLength(100).optional(),
    slug: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    description: vine.string().trim().maxLength(500).optional(),
  })
)
