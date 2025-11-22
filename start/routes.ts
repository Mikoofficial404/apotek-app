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
const OrderController = () => import('#controllers/orders_controller')
const OrderItemsController = () => import('#controllers/order_items_controller')
const CartController = () => import('#controllers/carts_controller')
const CartsItemsController = () => import('#controllers/carts_items_controller')
const PaymentController = () => import('#controllers/payment_controller')
const AddressesController = () => import('#controllers/addresses_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
const AuthController = () => import('#controllers/auth_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/uploads/*', async ({ request, response }) => {
  try {
    const filePath = request.url().replace('/uploads/', '')
    const fullPath = app.makePath(`uploads/${filePath}`)
    return response.download(fullPath)
  } catch (error) {
    return response.status(404).json({ message: 'File not found' })
  }
})
router
  .group(() => {
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])

    router
      .resource('/category', CategoriesController)
      .apiOnly()
      .use(['index', 'show', 'store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    router
      .resource('/supplier', SupplierController)
      .apiOnly()
      .use(['index', 'show', 'store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    // Products (index & show public, lainnya perlu auth)
    router.get('/products', [ProductController, 'index'])
    router.get('/products/:id', [ProductController, 'show'])
    router
      .group(() => {
        router.post('/', [ProductController, 'store'])
        router.put('/:id', [ProductController, 'update'])
        router.delete('/:id', [ProductController, 'destroy'])
      })
      .prefix('/products')
      .use(middleware.auth({ guards: ['api'] }))

    // Addresses
    router
      .resource('/addresses', AddressesController)
      .apiOnly()
      .use(['index', 'show', 'store', 'update', 'destroy'], middleware.auth({ guards: ['api'] }))

    // Carts Group API
    router
      .group(() => {
        router.get('/', [CartController, 'index'])
        router.post('/', [CartController, 'store'])
        router.get('/:id', [CartController, 'show'])
        router.delete('/:id', [CartController, 'destroy'])

        // Car
        router.post('/:cartId/items', [CartsItemsController, 'store'])
        router.put('/:cartId/items', [CartsItemsController, 'update'])
        router.delete('/:cartId/items', [CartsItemsController, 'destroy'])
      })
      .prefix('/carts')
      .use(middleware.auth({ guards: ['api'] }))

    // Orders Group API
    router
      .group(() => {
        router.get('/', [OrderController, 'index'])
        router.post('/checkout', [OrderController, 'checkout'])
        router.post('/', [OrderController, 'createOrder'])
        router.get('/:id', [OrderController, 'show'])
        router.put('/:id', [OrderController, 'update'])
        router.delete('/:id', [OrderController, 'destroy'])
      })
      .prefix('/orders')
      .use(middleware.auth({ guards: ['api'] }))

    // Order Items GROUP API
    router
      .group(() => {
        router.post('/', [OrderItemsController, 'store'])
        router.put('/:id', [OrderItemsController, 'update'])
        router.delete('/:id', [OrderItemsController, 'destroy'])
      })
      .prefix('/order-items')
      .use(middleware.auth({ guards: ['api'] }))

    // Payment routes buat midtrans
    router.post('/payment/notification', [PaymentController, 'notification'])
    router.get('/payment/status/:orderCode', [PaymentController, 'checkStatus'])
    router.put('/payment/manual-update/:orderCode', [PaymentController, 'manualUpdateStatus'])
  })
  .prefix('/api')

// Payment callback routes (tanpa prefix /api karena dipanggil dari Midtrans redirect)
router
  .group(() => {
    router.get('/finish', [PaymentController, 'finish'])
    router.get('/pending', [PaymentController, 'pending'])
    router.get('/error', [PaymentController, 'error'])
  })
  .prefix('/payment')
