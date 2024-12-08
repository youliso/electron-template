export class AudioHelper {
  mediaStream: MediaStream;
  audioctx: AudioContext;
  gainNode: GainNode;
  destAudioNode: MediaStreamAudioDestinationNode;
  get audioTracks(): MediaStreamTrack[] {
    return this.destAudioNode.stream.getAudioTracks();
  }

  constructor() {
    this.mediaStream = new MediaStream();
    this.audioctx = new AudioContext();
    this.gainNode = this.audioctx.createGain(); // 用来控制音量
    this.destAudioNode = this.audioctx.createMediaStreamDestination();
    this.gainNode.connect(this.destAudioNode);
  }

  addTrack(track: MediaStreamTrack) {
    this.mediaStream.addTrack(track);
    const srcAudioNode = this.audioctx.createMediaStreamSource(
      this.mediaStream
    );
    srcAudioNode.connect(this.gainNode);
  }

  getVolumeMinMax() {
    return [this.gainNode.gain.minValue, this.gainNode.gain.maxValue];
  }

  getVolume() {
    return this.gainNode.gain.value;
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
  }
}

export class AudioRecorder {
  mediaRecorder: MediaRecorder | null = null;
  chunks: Blob[] = [];
  callback: (blob: Blob) => void;

  constructor(callback: (blob: Blob) => void) {
    this.callback = callback;
  }

  on() {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    this.mediaRecorder.onstart = () => {
      this.chunks = [];
    };
    this.mediaRecorder.onstop = async () => {
      this.callback && this.callback(new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' }));
    };
  }

  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
      return null;
    });
    if (stream) {
      this.mediaRecorder = new MediaRecorder(stream);
      this.on();
      return 1;
    } else {
      return 0;
    }
  }

  start(timeslice?: number) {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.start(timeslice);
  }

  stop() {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.stop();
  }

  close() {
    this.mediaRecorder = null;
  }
}

export class AudioPlay {
  // 当前播放源
  public src: string | undefined;
  // 播放状态 1播放 0 暂停
  public type: 0 | 1 = 0;
  // 播放位置
  public ingTime: number = 0;
  // 总时长
  public allTime: number = 0;
  // 已缓存时长
  public cachedTime: number = 0;
  // 缓存进度
  public cachedType: number = 0;
  // 音量
  public volume: number = 1;
  // 音量渐进时间(秒)
  public volumeGradualTime: number = 0.7;
  // 音频的数据(可视化)
  public analyser: AnalyserNode;
  // 监听音频状态开始
  private audioPlay = new Event('audio-play');
  // 监听音频播放暂停
  private audioPause = new Event('audio-pause');
  // 监听音频播放完毕
  private audioEnd = new Event('audio-end');
  // 监听音频时间更新
  private audioTimeUpdate = new Event('audio-time-update');
  // 音频Context
  private AudioContext: AudioContext = new AudioContext();
  // 当前播放
  private currentAudio: HTMLAudioElement = new Audio();
  // 音频源
  private sourceAudio: MediaElementAudioSourceNode;
  // 控制节点
  private gainNode: GainNode;

  constructor() {
    this.currentAudio.crossOrigin = 'anonymous'; //音源跨域
    this.gainNode = this.AudioContext.createGain(); //创建控制节点
    this.sourceAudio = this.AudioContext.createMediaElementSource(this.currentAudio); //挂载音乐源
    this.analyser = this.AudioContext.createAnalyser();
    this.analyser.fftSize = 512; //精度
    this.sourceAudio.connect(this.analyser); //链接音频可视化
    this.sourceAudio.connect(this.gainNode); //链接音量控制节点
    this.gainNode.connect(this.AudioContext.destination); //链接音乐通道
    this.onAudio();
  }

  onAudio() {
    this.currentAudio.onerror = () => {
      console.log('错误');
    };

    this.currentAudio.oncanplay = () => {
      //可以开始播放
      this.currentAudio.play().catch(() => {
        console.log('错误');
      });
    };

    this.currentAudio.oncanplaythrough = () => {
      //当前歌曲缓存完毕
      this.cached();
    };

    this.currentAudio.ondurationchange = () => {
      //可获得歌曲时长
      this.allTime = this.currentAudio.duration;
    };

    this.currentAudio.onplay = () => {
      //开始播放
      this.gainNode.gain.value = 0; //设置音量为0
      this.currentTime(this.ingTime); //设置当前播放位置
      this.gainNode.gain.linearRampToValueAtTime(
        this.volume,
        this.AudioContext.currentTime + this.volumeGradualTime
      ); //音量淡入
      this.type = 1;
      dispatchEvent(this.audioPlay);
    };

    this.currentAudio.ontimeupdate = () => {
      //更新播放位置
      this.ingTime = this.currentAudio.currentTime;
      dispatchEvent(this.audioTimeUpdate);
    };

    this.currentAudio.onpause = () => {
      //播放暂停
      this.type = 0;
      dispatchEvent(this.audioPause);
    };

    this.currentAudio.onended = () => {
      //播放完毕
      this.clear();
    };
  }

  clear() {
    this.type = 0;
    this.ingTime = 0;
    this.allTime = 0;
    dispatchEvent(this.audioEnd);
  }

  async play(src?: string) {
    if (src) {
      this.currentAudio.src = src;
      this.src = src;
      return;
    }
    if (!src && !this.currentAudio.src && this.src) {
      this.currentAudio.src = this.src;
      return;
    }
    if (this.currentAudio.src && !isNaN(this.currentAudio.duration))
      this.currentAudio.play().catch(console.warn);
  }

  async pause() {
    return new Promise((resolve) => {
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.AudioContext.currentTime + this.volumeGradualTime
      ); //音量淡出
      setTimeout(() => {
        this.currentAudio.pause();
        resolve(0);
      }, this.volumeGradualTime * 1000);
    });
  }

  setSrc(src: string) {
    this.src = src;
  }

  clearSrc() {
    delete this.src;
  }

  load() {
    this.currentAudio.src && this.currentAudio.load();
  }

  //设置播放位置(暂停情况下)
  currentIngTime(e: number) {
    if (this.currentAudio) this.ingTime = e;
  }

  //设置播放位置(播放情况下)
  currentTime(e: number) {
    if (this.currentAudio) {
      this.gainNode.gain.value = 0; //设置音量为0
      this.currentAudio.currentTime = e;
      this.gainNode.gain.linearRampToValueAtTime(
        this.volume,
        this.AudioContext.currentTime + this.volumeGradualTime
      ); //音量淡入
    }
  }

  //设置音量 1-100
  setVolume(e: number) {
    let s = (e / 100).toFixed(2);
    if (this.currentAudio && this.gainNode) this.gainNode.gain.value = this.volume = Number(s);
    else this.volume = Number(s);
  }

  //是否单曲循环
  loop(e: boolean) {
    if (this.currentAudio) this.currentAudio.loop = e;
  }

  //缓存
  cached() {
    if (this.currentAudio && this.currentAudio.buffered.length > 0) {
      this.cachedTime = this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1); //已缓存时长
      this.cachedType =
        this.currentAudio.buffered.end(this.currentAudio.buffered.length - 1) /
        this.currentAudio.duration; //缓存进度  0-1
    }
  }
}
