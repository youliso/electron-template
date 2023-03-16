import { css } from '@emotion/css/macro';

export default css`
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;

  > .bgm-but {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 2px 20px;
    font: bolder 14px/26px normal;
    z-index: 1;
  }

  > .back-but {
    position: absolute;
    top: 5px;
    right: 80px;
    padding: 2px 20px;
    font: bolder 14px/26px normal;
    z-index: 1;
  }

  > .c1,
  .c2,
  .c3 {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  > .c1 {
    opacity: 0;
  }

  > .c2 {
    background: #000;
  }

  > .c3 {
    background-color: transparent;
  }
`;
