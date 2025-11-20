import User from '#models/user'
import Cart from '#models/cart'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CartPolicy extends BasePolicy {
  async before(user: User | null, _action: string, ..._params: any[]) {
    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return
  }

  viewList(_user: User): AuthorizerResponse {
    return true
  }

  view(user: User, cart: Cart): AuthorizerResponse {
    return cart.userId === user.id
  }

  create(_user: User): AuthorizerResponse {
    return true
  }

  update(user: User, cart: Cart): AuthorizerResponse {
    return cart.userId === user.id
  }

  delete(user: User, cart: Cart): AuthorizerResponse {
    return cart.userId === user.id
  }
}
