import {
  SlashCommandBuilder,
  type CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";
import type { Command } from "../../types/Command";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Fetches a random anime image with optional filters.")
    .setNSFW(false)
    .addStringOption((option) =>
      option
        .setName("artist")
        .setDescription("Filter by artist name")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("tags")
        .setDescription(
          "Comma-separated tags to include (e.g., girl,kemonomimi)"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("without_tags")
        .setDescription("Comma-separated tags to exclude")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("rating")
        .setDescription("Content rating")
        .setRequired(false)
        .addChoices(
          { name: "Borderline", value: "borderline" },
          { name: "Explicit", value: "explicit" },
          { name: "Safe", value: "safe" },
          { name: "Suggestive", value: "suggestive" }
        )
    ) as SlashCommandBuilder,
  async execute(
    interaction: CommandInteraction,
    client: ExtendedClient
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: false });

    const artist: string | null = interaction.options.getString("artist");
    const tags: string | null = interaction.options.getString("tags");
    const withoutTags: string | null =
      interaction.options.getString("without_tags");
    const rating: string = interaction.options.getString("rating") ?? "safe";

    const queryParams = new URLSearchParams();
    queryParams.append("limit", "1");
    if (artist) queryParams.append("artist", artist);
    if (tags) queryParams.append("tags", tags.replace(/\s/g, ""));
    if (withoutTags)
      queryParams.append("without_tags", withoutTags.replace(/\s/g, ""));
    if (rating) queryParams.append("rating", rating);
    queryParams.append("limit", "1");

    let embedColor = 0xff69b4;
    let imageData: any = null;
    let errorMessage: string | null = null;

    try {
      const response = await fetch(
        `https://api.nekosapi.com/v4/images/random?${queryParams.toString()}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      imageData = data?.at(0);

      if (!imageData) {
        errorMessage = "No images found matching the specified filters.";
      } else {
        const dominantColor = imageData.color_dominant;
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
      console.error("Failed to fetch anime image:", error);
      errorMessage = "An error occurred while fetching the image.";
    }

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTimestamp()
      .setFooter({ text: "Powered by nekosapi.com" });

    if (errorMessage || !imageData) {
      embed
        .setTitle("Error")
        .setDescription(errorMessage || "No image data received.");
    } else {
      embed
        .setTitle("Random Anime Image")
        .setImage(imageData.url)
        .addFields(
          { name: "Rating", value: imageData.rating || "N/A", inline: true },
          {
            name: "Tags",
            value: imageData.tags?.join(", ") || "None",
            inline: true,
          },
          {
            name: "Artist",
            value: imageData.artist_name || "Unknown",
            inline: true,
          }
        );

      if (imageData.source_url) {
        embed.addFields({
          name: "Source",
          value: `[Link](${imageData.source_url})`,
          inline: true,
        });
      }
    }

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
