import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import CartPolicy from '#policies/cart_policy'

export default class CartsController {
  public async index({ bouncer, response }: HttpContext) {
    await bouncer.authorize('viewList' as any, Cart)

    const carts = await Cart.query()
      .preload('user')
      .preload('cartItems', (query) => {
        query.preload('product')
      })

    return response.ok(carts)
  }

  public async show({ bouncer, params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)
    if (await bouncer.with(CartPolicy).denies('view', cart)) {
      return response.forbidden('You are not authorized to show cart')
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

  public async store({ auth, bouncer, response }: HttpContext) {
    if (await bouncer.with(CartPolicy).denies('create')) {
      return response.forbidden('You are not authorized to delete cart')
    }

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

  public async destroy({ bouncer, params, response }: HttpContext) {
    const cart = await Cart.findOrFail(params.id)
    if (await bouncer.with(CartPolicy).denies('delete', cart)) {
      return response.forbidden('You are not authorized to delete cart')
    }

    await cart.delete()

    return response.ok({ message: 'Cart deleted successfully' })
  }
}
