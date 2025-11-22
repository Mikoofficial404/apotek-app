import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'

export default class CartsController {
  public async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const carts = await Cart.query()
      .where('user_id', user.id)
      .preload('user')
      .preload('cartItems', (query) => {
        query.preload('product')
      })

    return response.ok(carts)
  }

  public async show({ auth, params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)

    if (cart.userId !== auth.user!.id) {
      return response.forbidden('You are not authorized to view this cart')
    }

    await cart.load('cartItems', (query) => {
      query.preload('product')
    })

    const totalPrice = cart.cartItems.reduce((sum, item) => {
      return sum + item.product.harga * item.quantity
    }, 0)

    return response.ok({
      ...cart.toJSON(),
      totalPrice,
    })
  }

  public async store({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const existingCart = await Cart.query().where('user_id', user.id).first()

    if (existingCart) {
      return response.conflict({ message: 'User already has a cart' })
    }

    const cart = await Cart.create({
      userId: user.id,
    })

    return response.created(cart)
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)

    if (cart.userId !== auth.user!.id) {
      return response.forbidden('You are not authorized to delete this cart')
    }

    await cart.delete()

    return response.ok({ message: 'Cart deleted successfully' })
  }
}
