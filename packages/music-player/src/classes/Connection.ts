import type {
  AudioPlayer,
  AudioPlayerError,
  AudioResource,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import type { StageChannel, VoiceChannel } from "discord.js";
import EventEmitter from "node:events";
import type { Readable } from "node:stream";
import { Song } from "..";

/**
 * Events for the audio connection. This can be used to determine if a song is
 * playing or finished
 */
export interface ConnectionEvents {
  start: [];
  end: [];
  error: [error: AudioPlayerError];
}

export class Connection extends EventEmitter {
  /** VoiceConnection obtained by calling {@link joinVoiceChannel} */
  private _connection?: VoiceConnection;
  /** AudioPlayer obtained by calling {@link createAudioPlayer} */
  private _player: AudioPlayer;
  /** Channel that the music will be played */
  private _channel: VoiceChannel | StageChannel;

  constructor(
    connection: VoiceConnection,
    channel: VoiceChannel | StageChannel
  ) {
    super();

    this._connection = connection;

    this._player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    this._channel = channel;

    this._connection.on("stateChange", (oldState, newState) => {
      console.log(
        `Connection state from ${oldState.status} to ${newState.status}.`
      );
      // TODO: handle more state changes
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
        // the player enters Idle state just now
        this.emit("end");
      } else if (
        oldState.status !== AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Playing
      ) {
        // the player enters Playing state just now
        this.emit("start");
      }
    });

    this._player.on("error", (err) => {
      this.emit("error", err);
    });

    this._connection.subscribe(this._player);
  }

  public createAudioStream(stream: Readable, type: StreamType, metadata: Song) {
    const resource = createAudioResource(stream, {
      inputType: type,
      metadata: metadata,
    });

    return resource;
  }

  public async playAudioStream(resource: AudioResource<Song>) {
    if (!this._connection) {
      throw new Error("No voice connection");
    }
    if (!resource) {
      throw new Error("Resource not ready");
    }

    if (this._connection.state.status !== VoiceConnectionStatus.Ready) {
      await entersState(this._connection, VoiceConnectionStatus.Ready, 20_000);
    }

    this._player.play(resource);

    return this;
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
    if (
      this._player.state.status === AudioPlayerStatus.Idle ||
      this._player.state.status === AudioPlayerStatus.Buffering
    ) {
      return null;
    }

    return this._player.state.resource.playbackDuration;
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

  public once<E extends keyof ConnectionEvents>(
    event: E,
    listener: (...args: ConnectionEvents[E]) => void
  ) {
    return super.once(event, listener);
  }

  public on<E extends keyof ConnectionEvents>(
    event: E,
    listener: (...args: ConnectionEvents[E]) => void
  ) {
    return super.on(event, listener);
  }

  public emit<E extends keyof ConnectionEvents>(
    event: E,
    ...args: ConnectionEvents[E]
  ) {
    return super.emit(event, ...args);
  }
}
