import { css } from '@emotion/css/macro';

export default css`
  padding: ${window.customize.headNative ? '10px' : '32px'} 10px 10px;
  > .test {
    padding-bottom: 10px;
  }
`;
