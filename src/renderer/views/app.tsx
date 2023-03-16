import Head from './components/head';

const head = new Head();

export const render = async () => {
  return (
    <div class="container">
      {head.render()}
      <div router></div>
    </div>
  );
};
