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
    .setName("kick")
    .setDescription("Kick a user from server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Pick the member you want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Write a reason why'd you have to kick this user")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .setDMPermission(false) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction | CommandInteraction,
    client: ExtendedClient
  ) {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.memberPermissions?.has(PermissionsBitField.Flags.KickMembers)
    ) {
      await interaction.editReply({
        content: "You do not have permission to use this command.",
      });
      return;
    }

    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(user?.id as string);

    if (!reason) reason = "No reason is provided.";

    if (!member?.kickable)
      await interaction.editReply({
        content: `user <@${user?.id}> can't be kicked!`,
      });

    await member
      ?.kick(reason)
      .catch(async (err) => await interaction.editReply({ content: err }));
    await interaction.editReply({
      content: `user <@${user?.id}> is kicked ${
        reason ? `with a reason of: \`${reason}\`` : "with no reason."
      }`,
    });
  },
};

export default command;
