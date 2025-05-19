import type { Interaction } from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";
import type { BotEvent } from "../../types/BotEvent";

const event: BotEvent<"interactionCreate"> = {
  name: "interactionCreate",
  async execute(client: ExtendedClient, interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};

export default event;
