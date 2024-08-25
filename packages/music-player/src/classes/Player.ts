import { Client, Collection, Snowflake, TextChannel } from "discord.js";
import EventEmitter from "node:events";
import { Queue, Song } from "..";

/**
 * Define the events might be emitted by the player and the corresponding
 * parameters
 */
export interface PlayerEvents {
  channelEmpty: [queue: Queue];
  songAdd: [queue: Queue, song: Song];
  queueEnd: [queue: Queue];
  songChanged: [queue: Queue, oldSong: Song | null, newSong: Song];
  clientDisconnect: [queue: Queue];
  error: [error: string, queue: Queue];
}

export enum PlayerEventNames {
  channelEmpty = "channelEmpty",
  songAdd = "songAdd",
  queueEnd = "queueEnd",
  songChanged = "songChanged",
  clientDisconnect = "clientDisconnect",
  error = "error",
}

export enum PlayerErrors {
  NONE,
  NOT_VOICE_CHANNEL,
  NOT_REPEAT_MODE,
  NO_AUDIO_RESOURCE,
  NO_VOICE_CONNECTION,
  UNKNOWN,
}

/**
 * The starting point of the music player. Manages multiples music queues in
 * different guilds. Handles music related evenets
 */
export class Player extends EventEmitter {
  private _client: Client;
  private queues: Collection<Snowflake, Queue>;

  constructor(client: Client) {
    super();

    this._client = client;
    this.queues = new Collection();

    this._client.on("voiceStateUpdate", (oldState, newState) => {
      const queue = this.queues.get(oldState.guild.id);
      if (!queue || !queue.connection) {
        return;
      }

      if (
        !newState.channelId &&
        this._client.user?.id === oldState.member?.id
      ) {
        // the bot is disconnected
        queue.leave();
        return void this.emit("clientDisconnect", queue);
      }

      if (oldState.channelId === newState.channelId) {
        return;
      }

      // TODO: filter out bot user
      // queue.connection.channel.members.at(0)?.user.bot;
      if (queue.connection.channel.members.size > 1) {
        return;
      }

      queue.leave();
      this.emit("channelEmpty", queue);
    });
  }

  public createQueue(guildId: Snowflake, channel: TextChannel) {
    if (this.queues.has(guildId)) {
      return this.queues.get(guildId) as Queue;
    } else {
      const guild = this._client.guilds.resolve(guildId);
      if (!guild) {
        throw "Not in Voice Channel";
      }

      const queue = new Queue(this, guild, channel);
      this.queues.set(guildId, queue);

      return queue;
    }
  }

  public getQueue(guildId: Snowflake) {
    return this.queues.get(guildId);
  }

  public hasQueue(guildId: Snowflake) {
    return this.queues.has(guildId);
  }

  public deleteQueue(guildId: Snowflake) {
    this.queues.delete(guildId);
  }

  public get client() {
    return this._client;
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
