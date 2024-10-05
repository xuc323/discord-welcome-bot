import { User } from "discord.js";
import {
  video_info,
  YouTubeVideo,
  search as yt_search,
  yt_validate,
} from "play-dl";
import { Song } from "..";

/**
 * This function searches for the source based on the search query.
 *
 * @param query Space separated string search query or URL
 * @param props
 * @returns
 */
export async function search(query: string, props: { requestedBy?: User }) {
  let song_info: YouTubeVideo;

  if (query.startsWith("https") && yt_validate(query) === "video") {
    let yt_info;
    try {
      yt_info = await video_info(query);
    } catch (err) {
      const error = err as Error;
      console.log(error);
      throw new Error(error.message);
    }

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

export function msToTime(duration: number) {
  const times: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    times.push(`${hours}`.padStart(2, "0"));
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  times.push(`${minutes}`.padStart(2, "0"));
  if (minutes > 0) {
    duration = duration - minutes * msInMinute;
  }

  const msInSecond = 1000;
  const seconds = Math.trunc(duration / msInSecond);
  times.push(`${seconds}`.padStart(2, "0"));

  return times.join(":");
}

export function sToTime(duration: number) {
  const times: string[] = [];

  const sInHour = 60 * 60;
  const hours = Math.trunc(duration / sInHour);
  if (hours > 0) {
    times.push(`${hours}`.padStart(2, "0"));
    duration = duration - hours * sInHour;
  }

  const sInMinute = 60;
  const minutes = Math.trunc(duration / sInMinute);
  times.push(`${minutes}`.padStart(2, "0"));
  if (minutes > 0) {
    duration = duration - minutes * sInMinute;
  }

  const seconds = duration;
  times.push(`${seconds}`.padStart(2, "0"));

  return times.join(":");
}
