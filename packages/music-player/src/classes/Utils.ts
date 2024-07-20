import { search as yt_search } from "play-dl";
import { Song } from "..";

export async function search(query: string) {
  const yt_info = await yt_search(query, { limit: 1 });
  const first = yt_info.at(0);
  console.log(first);

  const song = new Song({
    id: first?.id!,
    name: first?.title!,
    author: first?.channel?.name!,
    url: first?.url!,
    thumbnail: first?.thumbnails.at(0)?.url!,
    duration: first?.durationInSec!,
  });

  return song;
}

async function verifyUrl(url: string) {}

// Fisher–Yates Shuffle
export function shuffle(array: Song[]) {
  const clone = array.slice();

  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone.at(j)!, clone.at(i)!];
  }

  return clone;
}
