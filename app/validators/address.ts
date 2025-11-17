import vine from '@vinejs/vine'

export const addressValidator = vine.compile(
  vine.object({
    user_id: vine.number().exists({ table: 'users', column: 'id' }),
    label: vine.string().trim().maxLength(255),
    recipient_name: vine.string().trim().maxLength(255),
    phone_number: vine.string().trim().maxLength(20),
    address: vine.string().trim().maxLength(255),
    city: vine.string().trim().maxLength(255),
    province: vine.string().trim().maxLength(255),
    postal_code: vine.string().trim().maxLength(255),
  })
)
