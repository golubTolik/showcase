import PageController from './PageController'
import ProductController from './ProductController'
import CartController from './CartController'
import OrderController from './OrderController'
import FavoriteController from './FavoriteController'
import ProfileController from './ProfileController'
import SubscribeController from './SubscribeController'
import ContactController from './ContactController'
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
ContactController: Object.assign(ContactController, ContactController),
UserController: Object.assign(UserController, UserController),
Admin: Object.assign(Admin, Admin),
}

export default Controllers