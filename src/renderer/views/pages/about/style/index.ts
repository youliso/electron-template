import { css } from '@emotion/css/macro';
import { getCustomize } from '@/renderer/store';

const args = getCustomize();

export default css`
  padding: ${args.headNative ? '10px' : '32px'} 10px 10px;
  > .test {
    padding-bottom: 10px;
  }
`;
