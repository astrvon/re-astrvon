import { ActivityType, type PresenceStatusData } from "discord.js";
import type { ExtendedClient } from "../../types/ExtendedClient";
import type { BotEvent } from "../../types/BotEvent";
import dotenv from "dotenv";

dotenv.config();

const brainrotMessages: string[] = [
  "Gurt: sybau🥀",
  "Tralalelo Tralala 🦈👟",
  "Skibidi Toilet 🚽💥",
  "Ohio Rizzler 😎🔥",
  "GYATT Algorithm 🍑",
  "Brainrot Core 🧠⚡",
  "Mewing Streak 😼💪",
  "Sigma Grindset 🦁👑",
];

let messageIndex = 0;

const event: BotEvent<"ready"> = {
  name: "ready",
  once: true,
  async execute(client: ExtendedClient) {
    if (!client.user) {
      console.log("re-astrvon | Bot is ready, but client.user is undefined!");
      return;
    }

    console.log(
      `re-astrvon | Bot is now logged in as ${client.user.tag} and online!`
    );

    // Set the bot's presence
    const setBotPresence = () => {
      client.user?.setPresence({
        activities: [
          {
            name: brainrotMessages[messageIndex],
            type: ActivityType.Listening,
            url: "https://patchoulegs.my.id/",
          },
        ],
        status: process.env.STATUS as PresenceStatusData,
      });

      console.log(
        `re-astrvon | Bot status set to: ${client.user?.presence.status} with message: ${client.user?.presence.activities[0]?.name}`
      );

      messageIndex = (messageIndex + 1) % brainrotMessages.length;
    };

    setBotPresence();

    setInterval(setBotPresence, 30 * 1000);
  },
};

export default event;
