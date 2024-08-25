import { joinVoiceChannel } from "@discordjs/voice";
import {
  ChannelType,
  Guild,
  GuildChannelResolvable,
  PermissionFlagsBits,
  StageChannel,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
import { stream } from "play-dl";
import { Connection, Player, search, Song } from "..";

export enum RepeatMode {
  DISABLED,
  SONG,
  QUEUE,
}

export class Queue {
  private _player: Player;
  private _guild: Guild;
  private _messageChannel: TextChannel;
  private _connection?: Connection;
  private _songs: Song[];
  private _isPlaying: boolean;
  private _repeatMode: RepeatMode;
  private _destroyed: boolean;

  constructor(player: Player, guild: Guild, channel: TextChannel) {
    this._player = player;

    this._guild = guild;

    this._messageChannel = channel;

    this._songs = [];

    this._isPlaying = false;

    this._repeatMode = RepeatMode.DISABLED;

    this._destroyed = false;
  }

  public async join(channelId: GuildChannelResolvable) {
    if (this._connection) {
      return this;
    }

    const channel = this._guild.channels.resolve(channelId) as
      | StageChannel
      | VoiceChannel;
    if (!channel) {
      this._player.emit("error", "", this);
      throw "Not a Voice Channel";
    }

    if (
      ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(
        channel.type
      )
    ) {
      this._player.emit("error", "", this);
      throw "Not a Voice Channel Right?";
    }

    // check if the client has permission to CONNECT
    if (
      !channel
        .permissionsFor(this._player.client.user!)
        ?.has(PermissionFlagsBits.Connect)
    ) {
      this._player.emit("error", "", this);
      this._destroyed = true;
      this._player.deleteQueue(this._guild.id);
      throw new Error("No permission to join the Voice Channel");
    }

    const conn = joinVoiceChannel({
      guildId: channel.guild.id,
      channelId: channel.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    this._connection = new Connection(conn, channel);

    this._connection.on("start", (resource) => {
      this._isPlaying = true;
    });

    this._connection.on("end", async (resource) => {
      if (this._destroyed) {
        return;
      }

      this._isPlaying = false;
      const oldSong = this._songs.shift();
      if (this._songs.length === 0) {
        this._player.emit("queueEnd", this);
      } else {
        this._player.emit("songChanged", this, oldSong!, this._songs.at(0)!);
        await this._play();
      }
    });

    this._connection.on("error", (err) => {
      this._player.emit("error", err.name, this);
    });

    return this;
  }

  public async play(query: string, props?: { requestedBy: User }) {
    if (!this._connection) {
      this._player.emit("error", "", this);
      throw "No Voice Connection";
    }

    let song;
    try {
      song = await search(query, { requestedBy: props?.requestedBy });
    } catch (err) {
      this._player.emit("error", (err as Error).name, this);
      throw err;
    }

    this._songs.push(song);
    this._player.emit("songAdd", this, song);

    if (!this._isPlaying) {
      this._player.emit("songChanged", this, null, song);
      await this._play();
    }

    return song;
  }

  private async _play() {
    const song = this._songs.at(0);

    const _stream = await stream(song!.url);

    const resource = this._connection?.createAudioStream(_stream, song!);

    this._connection?.playAudioStream(resource!);
  }

  public shuffle() {
    const curr = this._songs.shift();

    for (let i = this._songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._songs[i], this._songs[j]] = [
        this._songs.at(j)!,
        this._songs.at(i)!,
      ];
    }

    this._songs.unshift(curr!);
  }

  public skip() {
    if (!this._connection) {
      this._player.emit("error", "", this);
      throw "No Voice Connection";
    }

    const song = this._songs.at(0);
    this._connection.stop();

    return song;
  }

  public async seek(seconds: number) {
    return false;
  }

  public stop() {}

  public createProgressBar() {
    return { prettier: "" };
  }

  public setRepeatMode(mode: RepeatMode) {
    if (!Object.values(RepeatMode).includes(mode)) {
      this._player.emit("error", "", this);
      throw "Not a repeat mode";
    }

    this._repeatMode = mode;
    return true;
  }

  public remove(index: number) {
    return new Song({
      id: "",
      name: "",
      author: "",
      url: "",
      thumbnail: "",
      duration: 100,
    });
  }

  public setPaused(status: boolean) {
    return false;
  }

  public setVolume(vol: number) {
    return false;
  }

  public leave() {
    this._destroyed = true;
    this._connection?.leave();
    this._player.deleteQueue(this._guild.id);
  }

  public get nowPlaying() {
    return this._connection?.resource?.metadata ?? this._songs.at(0);
  }

  public get songs() {
    return this._songs;
  }

  public get guild() {
    return this._guild;
  }

  public get messageChannel() {
    return this._messageChannel;
  }

  public get volume() {
    return 100;
  }

  public get connection() {
    return this._connection;
  }
}
