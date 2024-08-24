import { User } from "discord.js";

export interface SongProps {
  id: string;
  name: string;
  author: string;
  url: string;
  thumbnail: string;
  duration: number;
  requestedBy?: User;
  seekTime?: number;
}
export class Song {
  private _id: string;
  private _name: string;
  private _author: string;
  private _url: string;
  private _thumbnail: string;
  private _duration: number;
  private _requestedBy?: User;
  private _seekTime?: number;

  constructor(props: SongProps) {
    this._id = props.id;
    this._name = props.name;
    this._author = props.author;
    this._url = props.url;
    this._thumbnail = props.thumbnail;
    this._duration = props.duration;
    this._requestedBy = props.requestedBy;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get author() {
    return this._author;
  }

  public get url() {
    return this._url;
  }

  public get thumbnail() {
    return this._thumbnail;
  }

  public get duration() {
    return this._duration;
  }

  public get requestedBy() {
    return this._requestedBy;
  }

  public get seekTime() {
    return this._seekTime;
  }

  public toString(): string {
    return `${this._name} | ${this._author}`;
  }
}
