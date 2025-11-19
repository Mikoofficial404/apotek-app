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

  view(user: User, order: Cart): AuthorizerResponse {
    return user.role === 'admin' || order.userId === user.id
  }

  create(_user: User): AuthorizerResponse {
    return true
  }

  update(_user: User, _order: Cart): AuthorizerResponse {
    return _order.userId === _user.id
  }

  delete(_user: User, _order: Cart): AuthorizerResponse {
    return _order.userId === _user.id
  }
}
