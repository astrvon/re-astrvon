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
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select the member you want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason for banning this user.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setDMPermission(false) as SlashCommandBuilder,
  async execute(
    interaction: ChatInputCommandInteraction | CommandInteraction,
    client: ExtendedClient
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.memberPermissions?.has(PermissionsBitField.Flags.BanMembers)
    ) {
      await interaction.editReply({
        content: "You do not have permission to use this command.",
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
      return;
    }

    const user = interaction.options.getUser("target");
    let reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(user?.id as string);

    if (user?.id === interaction.user.id) {
      await interaction.editReply({
        content:
          "Bruh, you tryna yeet YOURSELF outta here? 💀 Skibidi toilet energy only, no self-ban Ohio vibes allowed! 🚫",
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
      return;
    }

    if (!reason) reason = "No reason provided.";

    if (member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.editReply({
        content: `Cannot ban <@${user?.id}> because they are an administrator!`,
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
      return;
    }

    if (member && !member.bannable) {
      await interaction.editReply({
        content: `User <@${user?.id}> cannot be banned!`,
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
      return;
    }

    try {
      await interaction.guild?.members.ban(user?.id as string, { reason });
      await interaction.editReply({
        content: `User <@${user?.id}> has been banned ${
          reason ? `with reason: \`${reason}\`` : "with no reason."
        }`,
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
    } catch (err) {
      await interaction.editReply({
        content: `Failed to ban user: ${err}`,
      });
      setTimeout(
        (): Promise<void> => interaction.deleteReply().catch((): void => {}),
        5000
      );
    }
  },
};

export default command;
