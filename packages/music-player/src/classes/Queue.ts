import { Guild, Snowflake } from "discord.js";
import { Connection, Song } from "..";

export enum RepeatMode {
  DISABLED,
  SONG,
  QUEUE,
}

export class Queue {
  private _guild: Guild;
  private _connection?: Connection;
  private _songs: Song[];
  private _isPlaying: boolean;
  private _repeatMode: RepeatMode;

  constructor(guild: Guild) {
    this._guild = guild;

    this._songs = [];

    this._isPlaying = false;

    this._repeatMode = RepeatMode.DISABLED;
  }

  public join() {}

  public shuffle() {
    for (let i = this._songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._songs[i], this._songs[j]] = [
        this._songs.at(j)!,
        this._songs.at(i)!,
      ];
    }
  }

  public get nowPlaying() {
    return this._connection?.resource?.metadata ?? this._songs.at(0);
  }
}
