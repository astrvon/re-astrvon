import {
  SlashCommandBuilder,
  CommandInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { ExtendedClient } from './ExtendedClient';

export interface Command {
  data: SlashCommandBuilder;
  execute: (
    interaction: CommandInteraction | ChatInputCommandInteraction,
    client: ExtendedClient,
  ) => Promise<void>;
}
