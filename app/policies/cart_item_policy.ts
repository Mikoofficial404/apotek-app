import User from '#models/user'
import CartItem from '#models/cart_item'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CartItemPolicy extends BasePolicy {
  async before(user: User | null, _action: string, ..._params: any[]) {
    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return
  }

  async view(user: User, cartItem: CartItem): Promise<AuthorizerResponse> {
    await cartItem.load('cart')
    return cartItem.cart.userId === user.id
  }

  async create(user: User, cartId: number): Promise<AuthorizerResponse> {
    const cartModule = await import('#models/cart')
    const Cart = cartModule.default
    const cart = await Cart.find(cartId)
    if (!cart) return false
    return cart.userId === user.id
  }

  async update(user: User, cartItem: CartItem): Promise<AuthorizerResponse> {
    await cartItem.load('cart')
    return cartItem.cart.userId === user.id
  }

  async delete(user: User, cartItem: CartItem): Promise<AuthorizerResponse> {
    await cartItem.load('cart')
    return cartItem.cart.userId === user.id
  }
}
