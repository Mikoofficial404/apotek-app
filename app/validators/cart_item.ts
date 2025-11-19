import vine from '@vinejs/vine'

export const addCartItemValidator = vine.compile(
  vine.object({
    cartId: vine.number().exists({ table: 'carts', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
  })
)

export const updateCartItemValidator = vine.compile(
  vine.object({
    cartId: vine.number().exists({ table: 'carts', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
  })
)

// Untuk menghapus item dari cart biasanya cukup butuh cartId dan productId.
// Quantity tidak diperlukan sehingga tidak divalidasi di sini.
export const removeCartItemValidator = vine.compile(
  vine.object({
    cartId: vine.number().exists({ table: 'carts', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
  })
)
