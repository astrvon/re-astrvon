import dotenv from "dotenv";
import fs from "node:fs";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import type { Command } from "./types/Command";
import type { ExtendedClient } from "./types/ExtendedClient";

dotenv.config();

const client: ExtendedClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((f) => f.endsWith(".ts"));
  for (const file of functionFiles) {
    const functionModule = require(`./functions/${folder}/${file}`);
    if (typeof functionModule === "function") {
      functionModule(client);
    } else if (typeof functionModule.default === "function") {
      functionModule.default(client);
    } else {
      console.error(`File ${file} does not export a function`);
    }
  }
}

client.handleEvents();
client.handleCommands();

client.login(process.env.TOKEN).then(() => console.log("Bot is logged in."));
