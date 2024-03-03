import SongItems from "./songItems";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className="p-5">
      <div>
        <h1 className="p-5 text-center text-3xl font-bold">
          Discord Welcome Bot
        </h1>
      </div>
      <div>
        <h2 className="text-center text-lg">Songs Recently Played</h2>
      </div>
      <table className="mx-auto my-2 border-collapse border table-auto shadow-lg">
        <thead>
          <tr>
            <th className="border p-3">Song Name</th>
            <th className="border p-3">Author</th>
            <th className="border p-3">Song URL</th>
            <th className="border p-3">Requested On</th>
          </tr>
        </thead>
        <SongItems />
      </table>
    </main>
  );
}
