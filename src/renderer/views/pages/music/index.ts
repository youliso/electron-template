import { View } from '@//renderer/common/dom';
import styles from './scss/index.lazy.scss';
import { init } from './demo';
import Head from '@/renderer/views/components/head';

export default class Music extends View {
  components = {
    Head: new Head()
  };

  onLoad(params?: any) {
    styles.use();
  }

  onActivated() {
    styles.use();
  }

  onDeactivated() {
    styles.unuse();
  }

  onReady() {}

  onUnmounted() {
    styles.unuse();
  }

  render() {
    return init();
  }
}
