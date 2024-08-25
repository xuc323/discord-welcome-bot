import { search as yt_search } from "play-dl";
import { Song } from "..";
import { User } from "discord.js";

export async function search(query: string, props: { requestedBy?: User }) {
  const yt_info = await yt_search(query, { limit: 1 });
  const first = yt_info.at(0);

  const song = new Song({
    id: first?.id!,
    name: first?.title!,
    author: first?.channel?.name!,
    url: first?.url!,
    thumbnail: first?.thumbnails.at(0)?.url!,
    duration: first?.durationInSec!,
    requestedBy: props.requestedBy,
  });

  return song;
}

export async function verifyUrl(url: string) {
  if (RegexList.YouTubeVideo.test(url)) {
    return true;
  }
  return false;
}

export class RegexList {
  public static readonly YouTubeVideo =
    /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)/;
  public static readonly YouTubeVideoTime = /(([?]|[&])t=(\d+))/;
  public static readonly YouTubeVideoID =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  public static readonly YouTubePlaylist =
    /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/;
  public static readonly YouTubePlaylistID = /[&?]list=([^&]+)/;
}
