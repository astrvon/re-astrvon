import { Client, Collection } from 'discord.js';
import { Command } from './Command';

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  commandArray: any[];
  handleEvents: () => Promise<void>;
  handleCommands: () => Promise<void>;
  config: {
    color: string;
  };
}
