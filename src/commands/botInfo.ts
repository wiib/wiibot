import { Command } from "../common/types";
import { colors, embedFooter } from "../common/constants";
import {CommandInteraction, EmbedBuilder, hyperlink, OAuth2Scopes, SlashCommandBuilder} from "discord.js";

export default class BotInfo implements Command {
    data = new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays useful information about the bot");

    async execute(interaction: CommandInteraction) {
        const inviteLink = interaction.client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
        })

        const e = new EmbedBuilder()
            .setColor(`#${colors.main}`)
            .setTitle("Bot Info")
            .setThumbnail(interaction.client.user!.avatarURL())
            .addFields([
                {
                    name: "Uptime",
                    inline: true,
                    value: `${interaction.client.uptime}`,
                },
                {
                    name: "Total Guilds",
                    inline: true,
                    value: `${interaction.client.guilds.cache.size}`,
                },
                {
                    name: "Invite URL",
                    inline: false,
                    value: `${hyperlink("Click here!", inviteLink)}`,
                },
            ])
            .setFooter({ text: embedFooter });

        await interaction.reply({ embeds: [e] });
    }
}