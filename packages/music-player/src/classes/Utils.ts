import { User } from "discord.js";
import { video_info, YouTubeVideo, search as yt_search } from "play-dl";
import { Song } from "..";

export async function search(query: string, props: { requestedBy?: User }) {
  let song_info: YouTubeVideo;
  if (verifyUrl(query)) {
    const yt_info = await video_info(query);
    song_info = yt_info.video_details;
  } else {
    const yt_info = await yt_search(query, {
      limit: 1,
      source: { youtube: "video" },
    });

    const _song_info = yt_info.at(0);
    if (!_song_info) {
      throw new Error("No song found");
    }

    song_info = _song_info;
  }

  const song = new Song({
    id: song_info.id!,
    name: song_info.title!,
    author: song_info.channel?.name!,
    url: song_info.url!,
    thumbnail: song_info.thumbnails.at(0)?.url!,
    duration: song_info.durationInSec!,
    requestedBy: props.requestedBy,
  });

  return song;
}

export function verifyUrl(url: string) {
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
