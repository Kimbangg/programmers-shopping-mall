import { qs, request } from '../utils/index.js';
import BaseComponent from '../core/Component.js';
import ProductList from '../components/ProductListPage/ProductList.js';

export default class ProductListPage extends BaseComponent {
  setup() {
    const { routeChange } = this.props;

    this.state = {
      products: [],
      isInit: false,
      routeChange,
    };
  }

  async init() {
    await this.fetchProducts();
  }

  template() {
    return `
            <div class="ProductListPage">
                <h1>상품목록</h1>
                <ul class="ProductList">
                </ul>
            </div>
        `;
  }

  selectDom() {
    this.$productUList = qs('.ProductList', this.$target);
  }

  render() {
    const { products, routeChange } = this.state;

    this.$target.innerHTML = this.template();

    this.selectDom();

    new ProductList(this.$productUList, {
      products,
      routeChange,
    });
  }

  componentDidUpdate() {
    this.render();
  }

  async fetchProducts() {
    const { isError, data: products } = await request('');

    if (!isError) {
      this.setState({
        ...this.state,
        isInit: true,
        products,
      });
    }
  }
}
