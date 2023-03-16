import { css } from '@emotion/css/macro';

export default css`
  width: 100%;
  height: 100%;
  padding: 32px 10px 10px;
  > .test {
    padding-bottom: 10px;
  }
  > .but {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
`;
