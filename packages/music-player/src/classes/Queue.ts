import { demuxProbe, joinVoiceChannel } from "@discordjs/voice";
import type {
  Guild,
  GuildChannelResolvable,
  StageChannel,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
import { ChannelType, PermissionFlagsBits } from "discord.js";
import youtubeDl from "youtube-dl-exec";
import { Connection, msToTime, Player, search, Song, sToTime } from "..";

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
  private _subprocess?: ReturnType<typeof youtubeDl.exec>;

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
      throw new Error("Not a Voice Channel");
    }

    if (
      ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(
        channel.type
      )
    ) {
      throw new Error("Not a Voice Channel Right?");
    }

    // check if the client has permission to CONNECT
    if (
      !channel
        .permissionsFor(this._player.client.user!)
        ?.has(PermissionFlagsBits.Connect)
    ) {
      this._destroyed = true;
      this._player.deleteQueue(this._guild.id);
      throw new Error("No permission to join the Voice Channel");
    }

    const conn = joinVoiceChannel({
      guildId: channel.guild.id,
      channelId: channel.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: true,
    });

    this._connection = new Connection(conn, channel);

    this._connection.on("start", () => {
      this._isPlaying = true;
    });

    this._connection.on("end", async () => {
      if (this._destroyed) {
        return;
      }

      this._isPlaying = false;
      this._subprocess = undefined;
      const oldSong = this._songs.shift();
      if (
        this._songs.length === 0 &&
        this._repeatMode === RepeatMode.DISABLED
      ) {
        this._player.emit("queueEnd", this);
      } else {
        if (this._repeatMode === RepeatMode.QUEUE) {
          this._songs.push(oldSong!);
        }
        this._player.emit("songChanged", this, oldSong!, this._songs.at(0)!);
        await this._play();
      }
    });

    this._connection.on("error", (err) => {
      console.log("Music player error: ", err);
      this._player.emit("error", err.name, this);
    });

    return this;
  }

  public async play(query: string, props?: { requestedBy: User }) {
    if (!this._connection) {
      throw new Error("No Voice Connection");
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

    const subprocess = youtubeDl.exec(song!.url, {
      output: "-",
      format: "bestaudio",
      quiet: true,
    });
    this._subprocess = subprocess;

    const { stream, type } = await demuxProbe(this._subprocess.stdout!);

    const resource = this._connection?.createAudioStream(stream, type, song!);

    this._connection?.playAudioStream(resource!);

    subprocess.catch((err: Error) => {
      console.log("Error in subprocess: ", err);
    });
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
      throw new Error("No Voice Connection");
    }

    this.stop();

    const song = this._songs.at(0);
    this._connection.stop();

    return song;
  }

  public async seek(seconds: number) {
    return false;
  }

  public stop() {
    if (this._subprocess) {
      this._subprocess.kill();
      this._subprocess = undefined;
    }
  }

  /**
   * Calculate the durations and create a progress bar
   *
   * @returns Formatted progress bar
   */
  public createProgressBar() {
    // get the string representation of song duration
    let songDuration = "";
    const sDuration = this.nowPlaying?.duration;
    if (sDuration) {
      songDuration = sToTime(sDuration);
    } else {
      // return early as the song is not supported
      return null;
    }

    // get the string representation of playback duration
    let playbackDuration = "";
    const pDuration = this._connection?.time;
    if (pDuration) {
      playbackDuration = msToTime(pDuration);
    }

    return `[${playbackDuration}/${songDuration}]`;
  }

  public setRepeatMode(mode: RepeatMode) {
    if (!Object.values(RepeatMode).includes(mode)) {
      throw new Error("Not a repeat mode");
    }

    this._repeatMode = mode;
    return true;
  }

  public remove(index: number) {
    if (this._destroyed) {
      return;
    }

    return this._songs.splice(index, 1).at(0);
  }

  public setPaused(status: boolean) {
    return false;
  }

  public setVolume(vol: number) {
    return false;
  }

  public leave() {
    this._destroyed = true;
    this.stop();
    this._connection?.leave();
    this._player.deleteQueue(this._guild.id);
  }

  public get nowPlaying() {
    return this._songs.at(0);
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
