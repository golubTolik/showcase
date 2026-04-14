import PageController from './PageController'
import ProductController from './ProductController'
import CartController from './CartController'
import OrderController from './OrderController'
import FavoriteController from './FavoriteController'
import ProfileController from './ProfileController'
import SubscribeController from './SubscribeController'
import UserController from './UserController'
import Admin from './Admin'
const Controllers = {
    PageController: Object.assign(PageController, PageController),
ProductController: Object.assign(ProductController, ProductController),
CartController: Object.assign(CartController, CartController),
OrderController: Object.assign(OrderController, OrderController),
FavoriteController: Object.assign(FavoriteController, FavoriteController),
ProfileController: Object.assign(ProfileController, ProfileController),
SubscribeController: Object.assign(SubscribeController, SubscribeController),
UserController: Object.assign(UserController, UserController),
Admin: Object.assign(Admin, Admin),
}

export default Controllers