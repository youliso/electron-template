import { init } from './demo';

export default class Music implements View {
  styles = [import('./style/index.l.scss')];

  render() {
    return init();
  }
}
