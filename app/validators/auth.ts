import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    role: vine.string().trim().in(['admin', 'user']),
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    password: vine.string().trim().confirmed(),
  })
)
