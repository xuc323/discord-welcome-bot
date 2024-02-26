import { Pool } from "pg";

// database class
class Database {
  private pool: Pool;

  constructor(url: string | undefined) {
    // create an instance of the database client
    this.pool = new Pool({ connectionString: url });
    this.createTables();
    // listen for connect event
    // this.pool.on("connect", (client: PoolClient) => {
    //   console.log("A client has established connection!");
    // });

    // listen for error event
    this.pool.on("error", (err: Error) => {
      console.error("ERROR: ", err.stack);
    });
  }

  /**
   * helper function to create all necessary tables
   */
  private createTables() {
    // query statement to create relational table if not exists
    const statement: string = `
            CREATE TABLE IF NOT EXISTS guilds(
                gid uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                id BIGINT UNIQUE NOT NULL,
                name TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS songs(
                sid uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                name TEXT NOT NULL,
                url TEXT UNIQUE NOT NULL,
                author TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users(
                uid uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator VARCHAR(8) NOT NULL,
                id BIGINT UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS requests(
                gid uuid NOT NULL REFERENCES guilds (gid),
                sid uuid NOT NULL REFERENCES songs (sid),
                uid uuid NOT NULL REFERENCES users (uid),
                date TIMESTAMP DEFAULT now()
            );
        `;

    this.pool.query(statement, (err, res) => {
      if (err) {
        console.error("Error creating tables: ", err.stack);
      }
    });
  }

  /**
   * When a song is requested, insert guild, song
   * and user into into database. Each insertion returns
   * a promise that resolves into unique id, and it's necessary
   * for the request table.
   */
  public playSongInsert(
    guild: { id: string; name: string },
    song: { name: string; url: string; author: string },
    user: { username: string; discriminator: string; id: string }
  ) {
    const gid_promise = this.guildInsert(guild.id, guild.name);
    const sid_promise = this.songInsert(song.name, song.url, song.author);
    const uid_promise = this.userInsert(
      user.username,
      user.discriminator,
      user.id
    );
    Promise.all([gid_promise, sid_promise, uid_promise])
      .then((values) => {
        const gid = values[0].rows[0].gid;
        const sid = values[1].rows[0].sid;
        const uid = values[2].rows[0].uid;
        this.requestInsert(gid, sid, uid);
      })
      .catch((err) => console.error(err));
  }

  /**
   * helper function to insert guild information into database
   */
  private guildInsert(id: string, name: string) {
    // prepare query statement
    const statement: string = `
            INSERT INTO guilds(id, name)
                VALUES($1, $2)
            ON CONFLICT (id) 
            DO 
                UPDATE SET name=$2
            RETURNING gid;
        `;

    // insert guild into database
    const values = [id, name];
    return this.pool.query(statement, values);
  }

  private songInsert(name: string, url: string, author: string) {
    // prepare query statement
    const statement = `
            INSERT INTO songs(name, url, author)
                VALUES($1, $2, $3)
            ON CONFLICT (url) 
            DO 
                UPDATE SET name=$1, author=$3
            RETURNING sid;
        `;

    // insert song into database
    const values = [name, url, author];
    return this.pool.query(statement, values);
  }

  private userInsert(username: string, discriminator: string, id: string) {
    // prepare query statement
    const statement = `
            INSERT INTO users(username, discriminator, id)
                VALUES($1, $2, $3)
            ON CONFLICT (id) 
            DO 
                UPDATE SET username=$1, discriminator=$2
            RETURNING uid;
        `;

    // insert user into database
    const values = [username, discriminator, id];
    return this.pool.query(statement, values);
  }

  private requestInsert(gid: string, sid: string, uid: string) {
    // prepare query statement
    const statement = `
            INSERT INTO requests(gid, sid, uid)
                VALUES($1, $2, $3);
        `;

    // insert request into database
    const values = [gid, sid, uid];
    return this.pool.query(statement, values);
  }

  public getRecentSongs(gid: string, limit: number) {
    // prepare query statement
    const statement = `
            WITH request AS (
                SELECT requests.date, songs.name, songs.url, songs.author, users.id, guilds.id AS guild_id
                    FROM requests
                    LEFT JOIN songs ON requests.sid = songs.sid
                    LEFT JOIN users ON requests.uid = users.uid
                    LEFT JOIN guilds ON requests.gid = guilds.gid
                    ORDER BY requests.date DESC
            )
            SELECT * FROM request
                WHERE request.guild_id = $1
                LIMIT $2;
        `;

    // insert request into database
    const values = [gid, limit];
    return this.pool.query(statement, values);
  }
}

export default Database;
