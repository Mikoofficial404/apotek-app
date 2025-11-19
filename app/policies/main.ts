/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  CartItemPolicy: () => import('#policies/cart_item_policy'),
  CartPolicy: () => import('#policies/cart_policy'),
  OrderItemPolicy: () => import('#policies/order_item_policy'),
  OrderPolicy: () => import('#policies/order_policy'),
  SupplierPolicy: () => import('#policies/supplier_policy'),
  CategoryPolicy: () => import('#policies/category_policy'),
  ProductPolicy: () => import('#policies/product_policy'),
}
