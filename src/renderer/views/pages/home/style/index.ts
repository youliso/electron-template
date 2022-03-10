import { css } from '@emotion/css/macro';
import { getCustomize } from '@/renderer/store';

const args = getCustomize();

export default css`
  width: 100%;
  height: 100%;
  padding: ${args.headNative ? '10px' : '32px'} 10px 10px;
  >.test{
    padding-bottom: 10px;
  }
  > .but {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
`;
