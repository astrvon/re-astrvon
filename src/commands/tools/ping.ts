import {
  SlashCommandBuilder,
  type CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";
import type { Command } from "../../types/Command";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Giving information of your ping.")
    .setNSFW(false),
  async execute(
    interaction: CommandInteraction,
    client: ExtendedClient
  ): Promise<void> {
    await interaction.deferReply({ fetchReply: true });

    const message = await interaction.fetchReply();
    const apiLatency: number = client.ws.ping;
    const clientPing: number =
      message.createdTimestamp - interaction.createdTimestamp;

    let animeImageUrl: string | null = null;
    let artistName: string | null = null;
    let embedColor = 0xff69b4;
    try {
      const response = await fetch(
        "https://api.nekosapi.com/v4/images/random?rating=safe&limit=1",
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json();
        animeImageUrl = data?.at(-1).url;
        artistName = data?.at(-1).artist_name;

        // Not using this cause we have dominant directly from API
        // const palette = await Vibrant.from(
        //   animeImageUrl as string
        // ).getPalette();
        // if (palette.Vibrant) {
        //   embedColor = Number.parseInt(
        //     palette.Vibrant.hex.replace("#", ""),
        //     16
        //   );
        // }

        const dominantColor = data?.at(-1).color_dominant;
        if (
          dominantColor &&
          Array.isArray(dominantColor) &&
          dominantColor.length === 3
        ) {
          const [r, g, b] = dominantColor;
          const hex = `${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          embedColor = Number.parseInt(hex, 16);
        }
      }
    } catch (error) {
      console.error("Failed to fetch anime image or extract color:", error);
    }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle("🏓 Pong!")
      .addFields(
        { name: "API Latency", value: `${apiLatency}ms`, inline: true },
        { name: "Client Ping", value: `${clientPing}ms`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Powered by nekosapi.com | astist: ${artistName}` });

    if (animeImageUrl) {
      embed.setThumbnail(animeImageUrl);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
