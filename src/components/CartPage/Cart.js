import BaseComponent from '../../core/Component.js';
import { removeItem, STORAGE_KEY } from '../../utils/index.js';
import { PATH } from '../../core/BrowserRouter.js';
import { ALERT_MESSAGE } from '../../utils/consts.js';

export default class Cart extends BaseComponent {
  setup() {
    const { cartItems, routeChange } = this.props;

    this.state = {
      cartItems,
      routeChange,
    };
  }

  template() {
    const { cartItems } = this.state;

    return `
            <ul>
                ${cartItems
                  .map(
                    ({
                      productName,
                      productImageUrl,
                      productPrice,
                      optionName,
                      optionPrice,
                      quantity,
                    }) => `
                    <li class="Cart__item">
                        <img src="${productImageUrl}">
                        <div class="Cart__itemDesription">
                        <div>${productName} ${optionName} ${(
                      productPrice + optionPrice
                    ).toLocaleString()}원 ${quantity}개</div>
                        <div>${(
                          (productPrice + optionPrice) *
                          quantity
                        ).toLocaleString()}원</div>
                        </div>
                    </li>
                `
                  )
                  .join('')}
            </ul>
            <div class="Cart__totalPrice">
                총 상품가격 ${this.getTotalPrice().toLocaleString()}원
            </div>
            <button class="OrderButton">주문하기</button>
        `;
  }

  setEvent() {
    const { routeChange } = this.state;

    this.$target.addEventListener('click', event => {
      if (event.target.className === 'OrderButton') {
        alert(ALERT_MESSAGE.SUCCESS_ORDER);
        removeItem(STORAGE_KEY);
        routeChange(PATH.PRODUCT_LIST_PAGE);
      }
    });
  }

  getTotalPrice() {
    const { cartItems } = this.state;

    return cartItems.reduce(
      (acc, item) =>
        acc + (item.productPrice + item.optionPrice) * item.quantity,
      0
    );
  }
}
