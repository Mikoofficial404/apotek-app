import User from '#models/user'
import Category from '#models/category'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CategoryPolicy extends BasePolicy {
  async before(user: User | null, _action: string, ..._params: any[]) {
    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return
  }

  view(user: User): AuthorizerResponse {
    return user.role === 'user'
  }

  create(_user: User): AuthorizerResponse {
    return false
  }

  update(_user: User, _category: Category): AuthorizerResponse {
    return false
  }

  delete(_user: User, _category: Category): AuthorizerResponse {
    return false
  }
}
