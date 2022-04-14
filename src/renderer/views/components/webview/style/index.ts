import { css } from '@emotion/css/macro';

export default css`
  width: 100%;
  height: 100%;
  padding: ${window.customize.headNative ? '10px' : '32px'} 0 0;
  > webview {
    width: 100%;
    height: 100%;
  }
`;
