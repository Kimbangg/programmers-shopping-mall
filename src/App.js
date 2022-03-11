import BrowserRouter, { PATH } from './core/BrowserRouter.js';
import CartPage from './pages/CartPage.js';
import ProductDetailPage from './pages/PageDetailPage.js';
import ProductListPage from './pages/PageListPage.js';

export default class App {
  constructor($target) {
    this.$target = $target;

    this.init();
  }

  init() {
    this.browserRouter = new BrowserRouter(this.switchRender.bind(this));
    this.switchRender();
  }

  switchRender() {
    const { pathname } = location;
    const { PRODUCT_LIST_PAGE, PRODUCT_DETAIL_PAGE, CART_PAGE } = PATH;
    const { routeChange } = this.browserRouter;

    const pathURL =
      pathname.indexOf('/web/products') === 0 ? '/web/products' : pathname;

    switch (pathURL) {
      case PRODUCT_LIST_PAGE:
        new ProductListPage(this.$target, {
          routeChange,
        });
        break;
      case PRODUCT_DETAIL_PAGE:
        const productId = pathname.split('/')[3];

        new ProductDetailPage(this.$target, {
          productId,
          routeChange,
        });
        break;
      case CART_PAGE:
        new CartPage(this.$target, {
          routeChange,
        });
        break;
    }
  }
}
