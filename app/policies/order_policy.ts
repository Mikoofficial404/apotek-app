import User from '#models/user'
import Order from '#models/order'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class OrderPolicy extends BasePolicy {
  async before(user: User | null, _action: string, ..._params: any[]) {
    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return
  }

  view(user: User, order: Order): AuthorizerResponse {
    return user.role === 'admin' || order.userId === user.id
  }

  create(_user: User): AuthorizerResponse {
    return true
  }

  update(_user: User, _order: Order): AuthorizerResponse {
    return _order.userId === _user.id
  }

  delete(_user: User, _order: Order): AuthorizerResponse {
    return _order.userId === _user.id
  }
}
