import BaseComponent from '../core/Component.js';
import Cart from '../components/CartPage/Cart.js';
import { getItem, qs, request, STORAGE_KEY } from '../utils/index.js';
import { ALERT_MESSAGE } from '../utils/consts.js';
import { PATH } from '../core/BrowserRouter.js';

export default class CartPage extends BaseComponent {
  setup() {
    const { routeChange } = this.props;

    this.state = {
      cartItems: [],
      isInit: false,
      routeChange,
    };
  }

  async init() {
    await this.fetchCartItemsInfo();
  }

  template() {
    return `
            <div class="CartPage">
                <h1>장바구니</h1>
                <div class="Cart">
                </div>
            </div>
        `;
  }

  selectDom() {
    this.$cart = qs('.Cart', this.$target);
  }

  render() {
    const { cartItems, routeChange } = this.state;

    if (cartItems.length === 0) {
      alert(ALERT_MESSAGE.EMPTY_CART);
      routeChange(PATH.PRODUCT_LIST_PAGE);
    } else {
      this.$target.innerHTML = this.template();

      this.selectDom();

      new Cart(this.$cart, {
        cartItems,
        routeChange,
      });
    }
  }

  componentDidUpdate() {
    this.render();
  }

  async fetchCartItemsInfo() {
    const cartData = getItem(STORAGE_KEY, []);

    const cartItems = await Promise.all(
      cartData.map(async cartItem => {
        // cartItem : [productId, optionId, quantity];
        const { isError, data: product } = await request(
          `/${cartItem.productId}`
        );
        const option = product.productOptions.find(
          option => option.id === cartItem.optionId
        );

        if (!isError) {
          return {
            productName: product.name,
            productImageUrl: product.imageUrl,
            productPrice: product.price,
            optionName: option.name,
            optionPrice: option.price,
            quantity: cartItem.quantity,
          };
        }
      })
    );

    this.setState({
      ...this.state,
      isInit: true,
      cartItems,
    });
  }
}
