import indexCss from './scss/index.lazy.scss';
import { init } from './demo';

export default class Music implements View {
  styles = [indexCss];

  render() {
    return init();
  }
}
