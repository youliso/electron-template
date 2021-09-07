import Store from '@/renderer/store';
import { domCreateElement } from '@/renderer/utils/dom';
import { windowShow } from '@/renderer/utils/window';
import styles from './scss/index.lazy.scss';

const args = Store.get<Customize>('customize');
const info = domCreateElement('div', 'demo-info');
const c1 = domCreateElement('canvas', 'c1');
const c2 = domCreateElement('canvas', 'c2');
const ctx1 = c1.getContext('2d');
const ctx2 = c2.getContext('2d');

info.appendChild(c1);
info.appendChild(c2);

export function onLoad() {
  styles.use();
}

export function onReady() {
  windowShow(args.id);
}

export function onUnmounted() {
  styles.unuse();
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

function loop() {
  requestAnimationFrame(loop);

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

function init() {
  resize();
  create();
  loop();
  window.addEventListener('resize', resize);
  info.addEventListener('click', click);
}

function resize() {
  cw = c1.width = c2.width = window.innerWidth;
  ch = c1.height = c2.height = window.innerHeight;
  create();
}

function click() {
  resize();
  create();
}

export default function (): View {
  init();
  return {
    dom: [info]
  };
}
