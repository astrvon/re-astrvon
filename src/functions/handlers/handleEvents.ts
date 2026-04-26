import fs from 'fs';
import { ClientEvents } from 'discord.js';
import { ExtendedClient } from '../../types/ExtendedClient';
import { BotEvent } from '../../types/BotEvent';

export default (client: ExtendedClient) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith('.ts'));
      switch (folder) {
        case 'client':
          for (const file of eventFiles) {
            const event: BotEvent<keyof ClientEvents> = require(
              `../../events/${folder}/${file}`,
            ).default;
            if (event.once) {
              client.once(
                event.name,
                (...args: ClientEvents[typeof event.name]) =>
                  event.execute(client, ...args),
              );
            } else {
              client.on(
                event.name,
                (...args: ClientEvents[typeof event.name]) =>
                  event.execute(client, ...args),
              );
            }
          }
          break;
        default:
          break;
      }
    }
  };
};
