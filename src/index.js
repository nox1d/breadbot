require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(foldersPath);
// console.log(`foldersPath: ${foldersPath}`);
// console.log(`commandsFolder: ${commandsFolder}`);

for (const folder of commandsFolder) {
  const commandsPath = path.join(foldersPath, folder);
  const commandsFile = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // console.log(`commandsPath: ${commandsPath}`);
  // console.log(`commandsFile: ${commandsFile}`);

  for (const file of commandsFile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // console.log(`filePath: ${filePath}`);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property. `
      );
    }
  }
}

// Log the client.commands Collection
// console.log('client.commands:');
// client.commands.forEach((command, name) => {
//   console.log(`Command name: ${name}`);
//   console.log(`Command details: ${JSON.stringify(command, null, 2)}`);
// });

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);
