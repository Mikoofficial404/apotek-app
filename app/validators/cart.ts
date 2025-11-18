import vine from '@vinejs/vine'

export const createCartValidator = vine.compile(
  vine.object({
    user_id: vine.number().exists({ table: 'users', column: 'id' }),
  })
)
