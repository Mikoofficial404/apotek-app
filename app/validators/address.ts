import vine from '@vinejs/vine'

export const addressValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'id' }),
    label: vine.string().trim().maxLength(255),
    recipientName: vine.string().trim().maxLength(255),
    phoneNumber: vine.string().trim().maxLength(20),
    address: vine.string().trim().maxLength(255),
    city: vine.string().trim().maxLength(255),
    province: vine.string().trim().maxLength(255),
    postalCode: vine.string().trim().maxLength(255),
  })
)
