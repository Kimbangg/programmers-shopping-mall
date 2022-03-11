import { PATH } from '../../core/BrowserRouter.js';
import BaseComponent from '../../core/Component.js';
import { ALERT_MESSAGE } from '../../utils/consts.js';
import { getItem, setItem, STORAGE_KEY } from '../../utils/index.js';

export default class SelectedOptionsComponent extends BaseComponent {
  setup() {
    const { selectedProduct, selectedOptions, routeChange } = this.props;

    this.state = {
      selectedProduct,
      selectedOptions,
      routeChange,
    };
  }

  template() {
    const { selectedProduct, selectedOptions } = this.state;

    return `
            <h3>선택된 상품</h3>
            <ul>
                ${selectedOptions
                  .map(
                    option => `
                    <li data-option-id="${option.optionId}">
                        ${selectedProduct.name} ${option.optionName} ${(
                      selectedProduct.price + option.optionPrice
                    ).toLocaleString()}원
                        <div><input type="number" value="${
                          option.quantity
                        }">개</div>
                    </li>
                `
                  )
                  .join('')}
            </ul>
            <div class="ProductDetail__totalPrice">${this.getTotalOptionPrice().toLocaleString()}원</div>
            <button class="OrderButton">주문하기</button>
        `;
  }

  setEvent() {
    const { routeChange } = this.state;

    this.$target.addEventListener('change', event => {
      if (event.target.tagName === 'INPUT') {
        const $li = event.target.closest('li');

        // 아이디 & 변경을 희망하는 수량.
        const selectedOptionId = parseInt($li.dataset.optionId);
        const nextQuantity = parseInt(event.target.value);

        // setState에 사용될 options
        const nextSelectedOptions = [...this.state.selectedOptions];
        const idx = nextSelectedOptions.findIndex(
          option => option.optionId === selectedOptionId
        );

        // stock에 대한 정보
        const option = this.state.selectedProduct.productOptions.find(
          option => option.id === selectedOptionId
        );

        if (nextQuantity <= 0) {
          alert(ALERT_MESSAGE.LESS_THAN_MINIMUM_COUNT);
          event.target.value = 1;
          return;
        }

        if (nextQuantity > option.stock) {
          alert(
            `재고 부족으로 ${option.stock}개 이상의 상품을 구매할 수 없습니다.`
          );
          event.target.value = option.stock;
          return;
        }

        nextSelectedOptions[idx].quantity = nextQuantity;

        this.setState({
          ...this.state,
          selectedOptions: nextSelectedOptions,
        });
      }
    });

    this.$target.addEventListener('click', event => {
      if (event.target.className === 'OrderButton') {
        const { selectedOptions } = this.state;

        const prevCartItem = getItem(STORAGE_KEY, []);

        const nextCartItem = prevCartItem.concat(
          selectedOptions.map(option => ({
            productId: option.productId,
            optionId: option.optionId,
            quantity: option.quantity,
          }))
        );

        if (nextCartItem.length === 0) {
          alert(ALERT_MESSAGE.INVALID_ADD_ACCESS);
          return;
        } else {
          setItem(STORAGE_KEY, nextCartItem);
          routeChange(PATH.CART_PAGE);
        }
      }
    });
  }

  componentDidUpdate() {
    this.$target.innerHTML = this.template();
  }

  getTotalOptionPrice() {
    const { selectedProduct, selectedOptions } = this.state;

    return selectedOptions.reduce(
      (acc, option) =>
        acc + (option.optionPrice + selectedProduct.price) * option.quantity,
      0
    );
  }
}
