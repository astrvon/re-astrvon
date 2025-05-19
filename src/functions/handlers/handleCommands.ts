import { REST, Routes } from "discord.js";
import fs from "node:fs";
import type { Command } from "../../types/Command";
import type { ExtendedClient } from "../../types/ExtendedClient";

export default (client: ExtendedClient) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands/");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((f: string) => f.endsWith(".ts"));

      for (const file of commandFiles) {
        const command: Command =
          require(`../../commands/${folder}/${file}`).default;
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const clientId = process.env.CLIENT_ID;
    if (!clientId) {
      throw new Error("CLIENT_ID is not defined in the environment variables");
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || "");
    try {
      console.log("re-astrvon | Start refreshing application (/) commands.");
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
      console.log(
        "re-astrvon | Successfully reloaded application (/) commands."
      );
    } catch (err) {
      console.error(err);
    }
  };
};
