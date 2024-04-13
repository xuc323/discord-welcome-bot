import { EventEmitter } from "node:events";
import { setTimeout } from "node:timers";
import {
  Client,
  Collection,
  GuildChannelResolvable,
  Message,
  Snowflake,
  VoiceState,
} from "discord.js";
import { Playlist, Queue, Song } from "..";

/**
 * Define the events might be emitted by the player
 * and the corresponding parameters
 */
export interface PlayerEvents {
  channelEmpty: [queue: Queue];
  songAdd: [queue: Queue, song: Song];
  playlistAdd: [queue: Queue, playlist: Playlist];
  queueEnd: [queue: Queue];
  queueDestroyed: [queue: Queue];
  songChanged: [queue: Queue, newSong: Song, oldSong: Song];
  songFirst: [queue: Queue, song: Song];
  clientDisconnect: [queue: Queue];
  clientUndeafen: [queue: Queue];
  error: [error: string, queue: Queue];
}

export interface PlayerOptions {
  leaveOnEnd?: boolean;
  leaveOnStop?: boolean;
  leaveOnEmpty?: boolean;
  deafenOnJoin?: boolean;
  timeout?: number;
  volume?: number;
  quality?: "low" | "high";
  localAddress?: string;
  ytdlRequestOptions?: object;
}

export const DefaultPlayerOptions: PlayerOptions = {
  leaveOnEnd: true,
  leaveOnStop: true,
  leaveOnEmpty: true,
  deafenOnJoin: false,
  timeout: 0,
  volume: 100,
  quality: "high",
};

export class Player extends EventEmitter {
  // the original discord client
  private client: Client;
  // queue data identify by guild id
  private queues: Collection<Snowflake, Queue>;
  private readonly options: PlayerOptions = DefaultPlayerOptions;

  constructor(client: Client, options: PlayerOptions = {}) {
    super();

    this.client = client;
    this.queues = new Collection();
    this.options = Object.assign({} as PlayerOptions, this.options, options);

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      this.handleVoiceUpdate(oldState, newState);
    });
  }

  private handleVoiceUpdate(oldState: VoiceState, newState: VoiceState) {
    /**
     * bot not in voice channel, nothing happens, return
     * bot in voice channel, check if muted, request unmute
     * bot in voice channel, bot got kicked, message, clear queue
     * bot in voice channel, user
     */
    const queue = this.getQueue(oldState.guild.id);

    // previously not playing, nothing happens
    if (!queue || !queue.connection) return;

    const { leaveOnEmpty, timeout } = queue.options;

    if (!newState.channelId && this.client.user?.id === oldState.member?.id) {
      // player recently drops connection, removing the queue
      queue.leave();
      return this.emit("clientDisconnect", queue);
    }

    // still in the same channel, nothing happens
    if (oldState.channelId === newState.channelId) return;

    // will not leave when nobody in the channel, or when more than one member in the channel
    if (!leaveOnEmpty || queue.connection.channel.members.size > 1) return;

    setTimeout(() => {
      if (!queue || !queue.connection) return;
      if (queue.connection.channel.members.size > 1) return;
      if (queue.connection.channel.members.has(this.client.user!.id)) {
        queue.leave();
        this.emit("channelEmpty", queue);
      }
    }, timeout);
  }

  // create and join the queue here
  public async createQueue(
    message: Message,
    options: PlayerOptions = this.options
  ) {
    options = Object.assign({} as PlayerOptions, this.options, options);

    const { guild } = message;
    if (!guild) {
      throw new Error();
    }
    if (this.hasQueue(guild.id) && !this.getQueue(guild.id)?.destroyed) {
      return this.getQueue(guild.id);
    }

    const queue = new Queue(this, guild, message.channelId, this.options);
    try {
      await queue.join(message.member?.voice.channel as GuildChannelResolvable);
    } catch {}
    this.setQueue(guild.id, queue);

    return queue;
  }

  private hasQueue(guildId: Snowflake) {
    return !!this.queues.get(guildId);
  }

  public getQueue(guildId: Snowflake) {
    return this.queues.get(guildId);
  }

  private setQueue(guildId: Snowflake, queue: Queue) {
    this.queues.set(guildId, queue);
  }

  public deleteQueue(guildId: Snowflake) {
    this.queues.delete(guildId);
  }

  public once<E extends keyof PlayerEvents>(
    event: E,
    listener: (...args: PlayerEvents[E]) => void
  ) {
    return super.once(event, listener);
  }

  public on<E extends keyof PlayerEvents>(
    event: E,
    listener: (...args: PlayerEvents[E]) => void
  ) {
    return super.on(event, listener);
  }

  public emit<E extends keyof PlayerEvents>(
    event: E,
    ...args: PlayerEvents[E]
  ) {
    return super.emit(event, ...args);
  }
}
