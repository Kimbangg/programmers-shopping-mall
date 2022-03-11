import { qs } from '../../utils/index.js';
import BaseComponent from '../../core/Component.js';
import SelectedOptionsComponent from './SelectedOptionsComponent.js';

export default class ProductDetail extends BaseComponent {
  setup() {
    const { selectedProduct, routeChange } = this.props;

    this.state = {
      selectedProduct,
      selectedOptions: [],
      routeChange,
    };
  }

  template() {
    const { selectedProduct } = this.state;
    const { id, name, price, imageUrl, productOptions } = selectedProduct;

    return `
            <h1>${name} 상품 정보</h1>
            <div class="ProductDetail">
            <img src="${imageUrl}">
            <div class="ProductDetail__info">
                <h2>${name}</h2>
                <div class="ProductDetail__price">${price.toLocaleString()}원~</div>
                <select class="ProductDetail__select">
                    <option>선택하세요.</option>
                    ${productOptions
                      .map(
                        option => `
                        <option value="${option.id}" ${
                          option.stock === 0 ? 'disabled' : ''
                        }>
                            ${option.stock === 0 ? '(품절)' : ''}
                            ${name} ${option.name} ${
                          option.price > 0 ? `(+${option.price})` : ''
                        }
                        </option>
                    `
                      )
                      .join('')}
                </select>
                <div class="ProductDetail__selectedOptions">
                </div>
            </div>
            </div>
        `;
  }

  selectDom() {
    this.$selectedOptions = qs('.ProductDetail__selectedOptions', this.$target);
    this.$selectBox = qs('.ProductDetail__select', this.$target);
  }

  setEvent() {
    // 최초 렌더링 시에 Select Box에 포커스가 잡히도록 합니다.
    this.$selectBox.focus();

    this.$target.addEventListener('change', event => {
      if (event.target.tagName === 'SELECT') {
        const { selectedProduct, selectedOptions } = this.state;

        const willAddedOptionId = parseInt(event.target.value);
        const willAddedOption = selectedProduct.productOptions.find(
          option => option.id === willAddedOptionId
        );
        const isAlreadyAdded = selectedOptions.find(
          option => option.optionId === willAddedOptionId
        )
          ? true
          : false;

        if (willAddedOption && !isAlreadyAdded) {
          const nextSelectedOptions = [
            ...this.state.selectedOptions,
            {
              productId: selectedProduct.id,
              optionId: willAddedOption.id,
              optionName: willAddedOption.name,
              optionPrice: willAddedOption.price,
              quantity: 1,
            },
          ];

          this.setState({
            ...this.state,
            selectedOptions: nextSelectedOptions,
          });
        } else {
          this.updateSelectBox();
        }
      }
    });
  }

  render() {
    const { selectedProduct, selectedOptions, routeChange } = this.state;

    this.$target.innerHTML = this.template();

    this.selectDom();
    this.setEvent();

    this.selectedOptionsComponent = new SelectedOptionsComponent(
      this.$selectedOptions,
      {
        selectedProduct,
        selectedOptions,
        routeChange,
      }
    );
  }

  componentDidUpdate() {
    const { selectedOptions } = this.state;

    this.updateSelectBox();

    this.selectedOptionsComponent.setState({
      ...this.state,
      selectedOptions,
    });
  }

  updateSelectBox() {
    const { selectedProduct } = this.state;
    const { name, productOptions } = selectedProduct;

    this.$selectBox.innerHTML = `
            <option>선택하세요.</option>
            ${productOptions
              .map(
                option => `
                <option value="${option.id}" ${
                  option.stock === 0 ? 'disabled' : ''
                }>
                    ${option.stock === 0 ? '(품절)' : ''}
                    ${name} ${option.name} ${
                  option.price > 0 ? `(+${option.price})` : ''
                }
                </option>
            `
              )
              .join('')}
        `;
  }
}
