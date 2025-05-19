import type { Command } from "../../types/Command";
import {
  type ChatInputCommandInteraction,
  type CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("change-nickname")
    .setDescription("Change a user's nickname in the server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select the member whose nickname you want to change.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Enter the new nickname for the user.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames)
    .setDMPermission(false) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction | CommandInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.memberPermissions?.has(
        PermissionsBitField.Flags.ManageNicknames
      )
    ) {
      await interaction.editReply({
        content: "You do not have permission to use this command.",
      });
      return;
    }

    const user = interaction.options.getUser("target");
    const nickname = interaction.options.getString("nickname");
    const member = interaction.guild?.members.cache.get(user?.id as string);

    if (!member) {
      await interaction.editReply({
        content: `User <@${user?.id}> not found in the server!`,
      });
      return;
    }

    if (!member.manageable) {
      await interaction.editReply({
        content: `Cannot change nickname for <@${user?.id}>!`,
      });
      return;
    }

    try {
      await member.setNickname(nickname);
      await interaction.editReply({
        content: `Nickname for <@${user?.id}> changed to \`${nickname}\`.`,
      });
    } catch (err) {
      await interaction.editReply({
        content: `Failed to change nickname: ${err}`,
      });
    }
  },
};

export default command;
