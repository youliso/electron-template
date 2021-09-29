import { View } from '@//renderer/common/dom';
import indexCss from './scss/index.lazy.scss';
import { init } from './demo';
import Head from '@/renderer/views/components/head';

export default class Music extends View {
  styles = [indexCss];
  components = {
    Head: new Head()
  };

  onLoad(params?: any) {}

  onActivated() {}

  onDeactivated() {}

  onReady() {}

  onUnmounted() {}

  render() {
    return init();
  }
}
