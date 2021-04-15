import { net } from '@/lib/net';

test('net get baidu', async () => {
  let req = await net('https://www.baidu.com/');
  console.log(req);
});