import PageController from './PageController'
import ProductController from './ProductController'
import CartController from './CartController'
import OrderController from './OrderController'
import UserController from './UserController'
const Controllers = {
    PageController: Object.assign(PageController, PageController),
ProductController: Object.assign(ProductController, ProductController),
CartController: Object.assign(CartController, CartController),
OrderController: Object.assign(OrderController, OrderController),
UserController: Object.assign(UserController, UserController),
}

export default Controllers