import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    role: vine.string().trim().in(['admin', 'user']),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.usersId)
          .where('email', value)
          .first()
        return !user
      }),
    password: vine.string().trim().confirmed(),
  })
)
