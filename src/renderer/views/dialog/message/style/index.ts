import { css } from '@emotion/css/macro';

export default css`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 32px 10px 10px;

  > .list {
    width: 100%;
    > .text {
      padding: 5px 0;
      display: flex;
      justify-content: center;
      --nameWidth: 100px;
      > .name {
        width: var(--nameWidth);
      }
      > .value {
        width: calc(100% - var(--nameWidth));
        word-break: break-all;
        font: normal 16px sans-serif;
      }
    }
  }

  > .buts {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;
