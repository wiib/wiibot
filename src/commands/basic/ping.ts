import dedent from "ts-dedent";
import { Command } from "../../common/types";
import { SlashCommandBuilder } from "discord.js";
import type { CommandInteraction } from "discord.js";

export default class PingCommand implements Command {
    public data = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot to see if it is alive.");

    public async execute(interaction: CommandInteraction) {
        const reply = await interaction.reply({ content: "Pinging...", fetchReply: true });
        const content = dedent`...Pong!
        Bot latency: ${Math.round(interaction.client.ws.ping)}ms.
        API Latency: ${reply.createdTimestamp - interaction.createdTimestamp}ms.`;

        await interaction.editReply(content);
    }
}
