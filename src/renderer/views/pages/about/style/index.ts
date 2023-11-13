import { css } from '@emotion/css/macro';

export default css`
  padding: ${window.environment.platform === 'win32' ? '32px' : '10px'} 10px 10px;
  > .test {
    padding-bottom: 10px;
  }
`;
