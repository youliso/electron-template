import { h } from '@youliso/granule';
import audio from '@/renderer/common/audio';
import Router from '@/renderer/router';
import style from './style';

const info = h('div', { class: style });
const bgmBut = h('button', { class: 'bgm-but' }, '播放');
const back = h('button', { class: 'back-but', onclick: () => Router.back() }, '返回');
const c1 = h('canvas', { class: 'c1' }) as HTMLCanvasElement;
const c2 = h('canvas', { class: 'c2' }) as HTMLCanvasElement;
const c3 = h('canvas', { class: 'c3' }) as HTMLCanvasElement;
const ctx1 = c1.getContext('2d') as CanvasRenderingContext2D;
const ctx2 = c2.getContext('2d') as CanvasRenderingContext2D;
const ctx3 = c3.getContext('2d') as CanvasRenderingContext2D;
info.appendChild(bgmBut);
info.appendChild(back);
info.appendChild(c1);
info.appendChild(c2);
info.appendChild(c3);

bgmBut.addEventListener('click', (event: Event) => {
  event.stopPropagation();
  if (audio.type) {
    bgmBut.textContent = '播放';
    audio.pause();
  } else {
    bgmBut.textContent = '暂停';
    audio.play();
  }
});

function bgm() {
  audio.setSrc('https://img-qn.51miz.com/preview/sound/00/23/00/51miz-S230038-F96C71EB-thumb.mp3');
  audio.loop(true);
}

const arr = new Uint8Array(audio.analyser.frequencyBinCount);
const BCount = audio.analyser.frequencyBinCount;
const barWidth = (window.innerWidth / BCount) * 1.5;
let barHeight: number;
let hslaData: string;

function bc() {
  requestAnimationFrame(bc);
  audio.analyser.getByteFrequencyData(arr);
  ctx3.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx3.fillStyle = hslaData;
  const xx = window.innerWidth / 2;
  for (let i = 0, xl = xx, xr = xx; i < BCount; i++) {
    if (xl < 0 || xr > window.innerWidth) {
      break;
    }
    barHeight = arr[i];
    const y = window.innerHeight / 2 - barHeight / 2;
    ctx3.fillRect(xl, y, barWidth, barHeight);
    ctx3.fillRect(xl, y, barWidth, 1);
    if (xl !== xx) {
      ctx3.fillRect(xr, y, barWidth, barHeight);
      ctx3.fillRect(xr, y, barWidth, 1);
    }
    xl -= barWidth + 1;
    xr += barWidth + 1;
  }
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function hsla(h: number, s: number, l: number, a: number) {
  return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

let twopi = Math.PI * 2;
let parts: { [key: string]: number }[] = [];
let sizeBase: number;
let cw: number;
let ch: number;
let opt;
let hue;
let count;

function create() {
  sizeBase = cw + ch;
  count = Math.floor(sizeBase * 0.3);
  hue = rand(0, 360);
  opt = {
    radiusMin: 1,
    radiusMax: sizeBase * 0.04,
    blurMin: 10,
    blurMax: sizeBase * 0.04,
    hueMin: hue,
    hueMax: hue + 100,
    saturationMin: 10,
    saturationMax: 70,
    lightnessMin: 20,
    lightnessMax: 50,
    alphaMin: 0.1,
    alphaMax: 0.5
  };
  ctx1.clearRect(0, 0, cw, ch);
  ctx1.globalCompositeOperation = 'lighter';
  while (count--) {
    const radius = rand(opt.radiusMin, opt.radiusMax),
      blur = rand(opt.blurMin, opt.blurMax),
      x = rand(0, cw),
      y = rand(0, ch),
      hue = rand(opt.hueMin, opt.hueMax),
      saturation = rand(opt.saturationMin, opt.saturationMax),
      lightness = rand(opt.lightnessMin, opt.lightnessMax),
      alpha = rand(opt.alphaMin, opt.alphaMax);

    hslaData = hsla(hue, saturation, lightness, 100);
    ctx1.shadowColor = hsla(hue, saturation, lightness, alpha);
    ctx1.shadowBlur = blur;
    ctx1.beginPath();
    ctx1.arc(x, y, radius, 0, twopi);
    ctx1.closePath();
    ctx1.fill();
  }

  parts.length = 0;
  for (let i = 0; i < Math.floor((cw + ch) * 0.03); i++) {
    parts.push({
      radius: rand(1, sizeBase * 0.03),
      x: rand(0, cw),
      y: rand(0, ch),
      angle: rand(0, twopi),
      vel: rand(0.1, 0.5),
      tick: rand(0, 10000)
    });
  }
}

let loopNum = 0;
function loop() {
  loopNum = requestAnimationFrame(loop);

  ctx2.clearRect(0, 0, cw, ch);
  ctx2.globalCompositeOperation = 'source-over';
  ctx2.shadowBlur = 0;
  ctx2.drawImage(c1, 0, 0);
  ctx2.globalCompositeOperation = 'lighter';

  let i = parts.length;
  ctx2.shadowBlur = 15;
  ctx2.shadowColor = '#fff';
  while (i--) {
    const part = parts[i];

    part.x += Math.cos(part.angle) * part.vel;
    part.y += Math.sin(part.angle) * part.vel;
    part.angle += rand(-0.05, 0.05);

    ctx2.beginPath();
    ctx2.arc(part.x, part.y, part.radius, 0, twopi);
    ctx2.fillStyle = hsla(0, 0, 100, 0.075 + Math.cos(part.tick * 0.02) * 0.05);
    ctx2.fill();

    if (part.x - part.radius > cw) {
      part.x = -part.radius;
    }
    if (part.x + part.radius < 0) {
      part.x = cw + part.radius;
    }
    if (part.y - part.radius > ch) {
      part.y = -part.radius;
    }
    if (part.y + part.radius < 0) {
      part.y = ch + part.radius;
    }

    part.tick++;
  }
}

function resize() {
  cw = c1.width = c2.width = c3.width = window.innerWidth;
  ch = c1.height = c2.height = c3.height = window.innerHeight;
  create();
}

function click() {
  resize();
  create();
}

export function onUnmounted() {
  window.removeEventListener('resize', resize);
  info.removeEventListener('click', click);
  loopNum && cancelAnimationFrame(loopNum);
}

export function render() {
  resize();
  create();
  loop();
  window.addEventListener('resize', resize);
  info.addEventListener('click', click);
  bgm();
  bc();
  return info;
}
