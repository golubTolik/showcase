import PageController from './PageController'
import ProductController from './ProductController'
import UserController from './UserController'
const Controllers = {
    PageController: Object.assign(PageController, PageController),
ProductController: Object.assign(ProductController, ProductController),
UserController: Object.assign(UserController, UserController),
}

export default Controllers