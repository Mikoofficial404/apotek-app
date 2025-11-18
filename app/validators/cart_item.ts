import vine from '@vinejs/vine'

export const addCartItemValidator = vine.compile(
  vine.object({
    cart_id: vine.number().exists({ table: 'carts', column: 'id' }),
    product_id: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
  })
)

export const updateCartItemValidator = vine.compile(
  vine.object({
    cart_id: vine.number().exists({ table: 'carts', column: 'id' }),
    product_id: vine.number().exists({ table: 'products', column: 'id' }),
    quantity: vine.number().min(1),
  })
)

// Untuk menghapus item dari cart biasanya cukup butuh cart_id dan product_id.
// Quantity tidak diperlukan sehingga tidak divalidasi di sini.
export const removeCartItemValidator = vine.compile(
  vine.object({
    cart_id: vine.number().exists({ table: 'carts', column: 'id' }),
    product_id: vine.number().exists({ table: 'products', column: 'id' }),
  })
)
