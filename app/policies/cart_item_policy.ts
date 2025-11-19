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

  async view(user: User, orderItem: CartItem): Promise<AuthorizerResponse> {
    await orderItem.load('cart')
    return user.role === 'admin' || orderItem.cart.userId === user.id
  }
}
