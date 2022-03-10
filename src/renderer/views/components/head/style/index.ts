import { css } from '@emotion/css/macro';

export default css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${window.environment.platform === 'darwin' ? 'padding-right: 10px;' : 'padding-left: 10px;'}

    > .title {
      font: normal 13px /13px ping-fang;
    }

    > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;

      > .event {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        width: 15px;
        height: 15px;
        margin-left: 5px;

        &:hover {
          opacity: 0.9;
        }

        &:active {
          opacity: 0.7;
        }

        &.close {
          background-color: var(--red);
        }

        &.min {
          background-color: var(--grey);
        }

        &.max-min {
          background-color: var(--cyan);
        }
      }
    }
  }
`;
