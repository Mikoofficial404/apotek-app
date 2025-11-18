/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const CategoriesController = () => import('#controllers/categories_controller')
const SupplierController = () => import('#controllers/suppliers_controller')
const ProductController = () => import('#controllers/products_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('#controllers/auth_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])

    //contoh
    //router.resource('/threads', ThreadsController).apiOnly().only(['index', 'show'])
    //router
    // .resource('/threads', ThreadsController)
    // .apiOnly()
    // .except(['index', 'show'])
    // .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    router
      .resource('/category', CategoriesController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    router
      .resource('/supplier', SupplierController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    router
      .resource('/products', ProductController)
      .apiOnly()
      .use(['store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api')
