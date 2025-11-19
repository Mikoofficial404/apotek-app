import User from '#models/user'
import Supplier from '#models/supplier'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class SupplierPolicy extends BasePolicy {
  async before(user: User | null) {
    if (!user) return false
    if (user.role === 'admin') return true
    return
  }

  view(_user: User): AuthorizerResponse {
    return true
  }

  create(_user: User): AuthorizerResponse {
    return false
  }

  update(_user: User, _supplier: Supplier): AuthorizerResponse {
    return false
  }

  delete(_user: User, _supplier: Supplier): AuthorizerResponse {
    return false
  }
}
