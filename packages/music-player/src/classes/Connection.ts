import {
  AudioPlayer,
  AudioPlayerError,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js";
import EventEmitter from "node:events";
import { Song } from "..";
import { YouTubeStream } from "play-dl";

export interface Connection extends EventEmitter {
  /** Emitted when the music starts */
  on(event: "start", listener: (resource: AudioResource<Song>) => void): this;

  /** Emitted when the music starts */
  emit(event: "start", resource: AudioResource<Song>): boolean;

  /** Emitted when the music ends */
  on(event: "end", listener: (resource: AudioResource<Song>) => void): this;

  /** Emitted when the music ends */
  emit(event: "end", resource: AudioResource<Song>): boolean;

  /** Emitted when there is an error from the connection */
  on(event: "error", listener: (error: AudioPlayerError) => void): this;

  /** Emitted when there is an error from the connection */
  emit(event: "error", error: AudioPlayerError): boolean;
}

export class Connection extends EventEmitter {
  private _connection?: VoiceConnection;
  private _player: AudioPlayer;
  private _channel: VoiceChannel | StageChannel;
  private _resource?: AudioResource<Song>;
  private _paused: boolean;

  constructor(
    connection: VoiceConnection,
    channel: VoiceChannel | StageChannel
  ) {
    super();

    this._connection = connection;

    this._paused = false;

    this._player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    this._channel = channel;

    this._connection.on("stateChange", (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Destroyed) {
        this.stop();
        this._connection = undefined;
      }
    });

    this._player.on("stateChange", (oldState, newState) => {
      console.log(
        `Player state from ${oldState.status} to ${newState.status}.`
      );
      if (
        oldState.status !== AudioPlayerStatus.Idle &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        // the player just enters Idle state
        if (!this._paused) {
          this.emit("end", this._resource!);
          this._resource = undefined;
        }
      } else if (
        oldState.status !== AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Playing
      ) {
        // the player starts playing
        if (!this._paused) {
          this.emit("start", this._resource!);
        }
      }
    });

    this._player.on("error", (error) => {
      this.emit("error", error);
    });

    this._connection.subscribe(this._player);
  }

  public createAudioStream(stream: YouTubeStream, metadata: Song) {
    this._resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true,
      metadata: metadata,
    });

    return this._resource;
  }

  public async playAudioStream(resource: AudioResource<Song>) {
    if (!this._connection) {
      throw new Error("No voice connection");
    }
    if (!resource) {
      throw new Error("Resource not ready");
    }
    if (!this._resource) {
      this._resource = resource;
    }

    if (this._connection.state.status !== VoiceConnectionStatus.Ready) {
      await entersState(this._connection, VoiceConnectionStatus.Ready, 20_000);
    }

    this._player.play(resource);

    return this;
  }

  public pause() {
    this._paused = true;
    return this._player.pause(true);
  }

  public unpause() {
    this._paused = false;
    return this._player.unpause();
  }

  public stop() {
    return this._player.stop();
  }

  public leave() {
    this._player.stop(true);
    if (this._connection) {
      this._connection.destroy();
    }
  }

  public get time() {
    if (!this._resource) {
      return 0;
    }

    return this._resource.playbackDuration;
  }

  public get volume() {
    if (!this._resource?.volume) return 100;
    return this._resource.volume.volume;
  }

  public get connection() {
    return this._connection;
  }

  public get player() {
    return this._player;
  }

  public get channel() {
    return this._channel;
  }

  public get resource() {
    return this._resource;
  }

  public get paused() {
    return this._paused;
  }
}
