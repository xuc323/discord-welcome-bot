import { postgres } from "@/components/database";
import Link from "next/link";

export default async function SongItems() {
  const rows = await postgres.selectAllSongsOrderByTime();

  return (
    <tbody>
      {rows &&
        rows.map((row, id) => (
          <tr key={id}>
            <td className="border px-2 py-1">{row.name}</td>
            <td className="border px-2 py-1">{row.author}</td>
            <td className="border px-2 py-1">
              <Link
                href={row.url!}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Youtube Link
              </Link>
            </td>
            <td className="border px-2 py-1">
              {row.requestedOn?.toLocaleDateString()}
            </td>
          </tr>
        ))}
    </tbody>
  );
}
