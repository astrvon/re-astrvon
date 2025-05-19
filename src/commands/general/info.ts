import {
  SlashCommandBuilder,
  type CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";
import type { Command } from "../../types/Command";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays information about the bot.")
    .setNSFW(false) as SlashCommandBuilder,
  async execute(
    interaction: CommandInteraction,
    client: ExtendedClient
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: false });

    const apiLatency: number = client.ws.ping;
    const message = await interaction.fetchReply();
    const clientPing: number =
      message.createdTimestamp - interaction.createdTimestamp;

    const deploymentLocation: string =
      process.env.DEPLOYMENT_LOCATION || "Unknown Server";

    const botAvatar =
      client.user?.displayAvatarURL({
        extension: "png",
        size: 512,
      }) || "https://via.placeholder.com/512";

    const inviteLink =
      "https://discord.com/oauth2/authorize?client_id=1298578132797755432";

    const commandsList: string =
      client.commands
        ?.map((cmd) => {
          const cmdData = cmd.data as SlashCommandBuilder;
          return `**/${cmdData.name}**: ${
            cmdData.description || "No description"
          }`;
        })
        .join("\n") || "No commands available.";

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${client.user?.username.toUpperCase()} Info`)
      .setThumbnail(botAvatar)
      .addFields(
        {
          name: "Deployment Location",
          value: deploymentLocation,
          inline: true,
        },
        {
          name: "API Latency",
          value: `${apiLatency}ms`,
          inline: true,
        },
        {
          name: "Client Ping",
          value: `${clientPing}ms`,
          inline: true,
        },
        {
          name: "Invite Link",
          value: inviteLink,
          inline: false,
        },
        {
          name: "Commands",
          value: commandsList,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
