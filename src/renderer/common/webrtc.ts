import { AudioHelper } from "./audio";

export const rtcStream = async (video: boolean = false) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: false,
    },
    video: video,
  });
  if (stream) {
    return stream;
  }
  return;
};

export class PeerConnection {
  stream: MediaStream | undefined;
  audioHelper: AudioHelper = new AudioHelper();
  offer: RTCSessionDescriptionInit | undefined;
  answer: RTCSessionDescriptionInit | undefined;
  connection: RTCPeerConnection | null = null;
  ontrack: ((streams: MediaStream[]) => void) | undefined;
  onstate: ((status: RTCIceConnectionState) => void) | undefined;
  onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | undefined;
  constructor() { }

  dispose() {
    if (this.connection) {
      this.connection.close();
      this.connection.onicecandidate = null;
      this.connection.ondatachannel = null;
      this.connection.ontrack = null;
      this.connection.onconnectionstatechange = null;
      this.connection = null;
    }
  }

  addStream(stream: MediaStream) {
    this.stream = stream;
    const tracks = this.stream.getTracks();
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index];
      if (track.kind === "audio") {
        this.audioHelper.addTrack(track);
      }
    }
  }

  async initialize() {
    const servers: RTCIceServer[] = [];
    if (!servers) {
      throw new Error("servers not");
    }
    this.connection = new RTCPeerConnection({ iceServers: servers });
    this.connection.onicecandidate = (event) => {
      this.onicecandidate && this.onicecandidate(event);
    };
    this.audioHelper.audioTracks.forEach((track) => {
      this.connection!.addTrack(track);
    });
    this.stream
      ?.getTracks()
      .filter((e) => e.kind !== "audio")
      .forEach((track) => {
        this.connection!.addTrack(track);
      });
    this.connection.ontrack = (event) => {
      this.ontrack && this.ontrack(event.streams as unknown as any);
    };
    this.connection.onconnectionstatechange = () => {
      this.onstate && this.onstate(this.connection!.iceConnectionState);
    };

    this.connection.onicecandidateerror = (error) => console.error(error);
  }

  async createOffer(
    options = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    }
  ) {
    if (!this.connection) {
      throw new Error("connection is not ready");
    }
    const offer = await this.connection.createOffer(options);
    this.offer = offer;
    this.connection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer() {
    if (!this.connection) {
      throw new Error("connection is not ready");
    }
    const answer = await this.connection.createAnswer();
    this.answer = answer;
    await this.connection.setLocalDescription(answer);
    return answer;
  }

  setRemoteSDP(sdp: RTCSessionDescription) {
    if (!this.connection) {
      throw new Error("connection is not ready");
    }
    return this.connection.setRemoteDescription(sdp);
  }

  onAnswer(sdp: string) {
    return this.setRemoteSDP(
      new RTCSessionDescription({ sdp, type: "answer" })
    );
  }

  async onOffer(sdp: string) {
    if (!this.connection) {
      throw new Error("connection is not ready");
    }
    await this.setRemoteSDP(new RTCSessionDescription({ sdp, type: "offer" }));
    try {
      return await this.createAnswer();
    } catch (e) {
      console.error(e);
      return;
    }
  }

  setRemoteCandidate(label: number, candidate: string) {
    if (!this.connection) {
      throw new Error("connection is not ready");
    }
    return this.connection.addIceCandidate(
      new RTCIceCandidate({ candidate, sdpMLineIndex: label })
    );
  }
}
