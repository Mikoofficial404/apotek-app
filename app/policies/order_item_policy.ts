import User from '#models/user'
import OrderItem from '#models/order_item'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class OrderItemPolicy extends BasePolicy {
  async before(user: User | null, _action: string, ..._params: any[]) {
    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return
  }

  async view(user: User, orderItem: OrderItem): Promise<AuthorizerResponse> {
    await orderItem.load('order')
    return user.role === 'admin' || orderItem.order.userId === user.id
  }

  create(_user: User): AuthorizerResponse {
    return true
  }

  async update(user: User, orderItem: OrderItem): Promise<AuthorizerResponse> {
    await orderItem.load('order')
    return orderItem.order.userId === user.id
  }

  async delete(user: User, orderItem: OrderItem): Promise<AuthorizerResponse> {
    await orderItem.load('order')
    return orderItem.order.userId === user.id
  }
}
