# Discord Welcome Bot

[Add **Discord Welcome Bot** to your Discord server](https://discord.com/api/oauth2/authorize?client_id=853751983683928114&permissions=274914761792&scope=bot)

[Github Page](https://xuc323.github.io/discord-welcome-bot)

# Requirements

- git
- node.js >= 16.x
- npm

# Usage

After clone the repo to your local machine, perform the following command to install the required dependencies:

```bash
$ npm install
```

After installing the required dependencies, run the following command to start the bot:

```bash
$ npm start
```

Or you can run the following command to start the bot with nodemon, so the bot will be automatically restarted once changes are detected:

```bash
$ npm test
```

# Environment Variables

### Discord Application Token

Obtain the Discord application token from the [Discord developer portal](https://discord.com/developers/applications).

Once the token is obtained, create a `.env` file to store the configurations. Remember to not leak those. Prefix is a special function call so the bot will not response to every single messages. You can choose any prefix as you wish.

This program uses postgresql as the database. URL format should be `postgres://{user}:{password}@{host}:{port}/{database}`.

```bash
# .env
DISCORD_TOKEN=YOUR_TOKEN
DATABASE_URL=POSTGRES_DATABASE_URL
PREFIX=!
```

# Templates

### Command Templates

```js
module.exports = {
  name: "",
  description: "",
  usage: "",
  category: "",
  aliases: [],
  agrs: true,
  execute() {
    // code to execute
  },
};
```

# Packages

- [discord-music-player](https://www.npmjs.com/package/discord-music-player)
- [discord.js](https://www.npmjs.com/package/discord.js)
