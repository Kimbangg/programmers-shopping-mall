import { request, qs } from '../utils/index.js';
import BaseComponent from '../core/Component.js';
import ProductDetail from '../components/ProductDetailPage/ProductDetail.js';

export default class ProductDetailPage extends BaseComponent {
  setup() {
    const { productId, routeChange } = this.props;

    this.state = {
      productId,
      selectedProduct: null,
      isInit: false,
      routeChange,
    };
  }

  async init() {
    await this.fetchProduct();
  }

  template() {
    return `
            <div class="ProductDetailPage">
            </div>
        `;
  }

  selectDom() {
    this.$productDetailPage = qs('.ProductDetailPage', this.$target);
  }

  render() {
    const { selectedProduct, routeChange } = this.state;

    this.$target.innerHTML = this.template();
    this.selectDom();

    new ProductDetail(this.$productDetailPage, {
      selectedProduct,
      routeChange,
    });
  }

  componentDidUpdate() {
    this.render();
  }

  async fetchProduct() {
    const { productId } = this.state;

    const { isError, data: selectedProduct } = await request(`/${productId}`);

    if (!isError) {
      this.setState({
        ...this.state,
        isInit: true,
        selectedProduct,
      });
    }
  }
}
