import { checkSame } from '../utils/helper.js';

export default class BaseComponent {
  constructor($target, props) {
    this.state = {};
    this.props = props;
    this.$target = $target;

    this.setup();
    this.init();
  }

  init() {
    this.render();
  }

  setup() {}

  selectDom() {}

  template() {
    return '';
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    this.$target.innerHTML = this.template();

    this.selectDom();
    this.setEvent();

    this.componentDidMount();
  }

  setEvent() {}

  setState(newState) {
    const nextState = { ...this.state, ...newState };

    if (checkSame(this.state, nextState)) return;

    this.state = { ...this.state, ...newState };
    // 상태를 업데이트하면, 어떤 변화를 줄지는 하위 컴포넌트의 update가 결정하도록 둘 것.
    this.componentDidUpdate();
  }

  addEvent(eventType, selector, cbFn) {
    const children = [...this.$target.querySelectorAll(selector)];

    const isTarget = target =>
      children.includes(target) || target.closest(selector);

    this.$target.addEventListener(eventType, event => {
      event.preventDefault();
      if (!isTarget(event.target)) return false;
      cbFn(event);
    });
  }
}
